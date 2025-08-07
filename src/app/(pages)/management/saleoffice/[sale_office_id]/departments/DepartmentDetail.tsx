'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Department } from "@/types/department";
import { useTranslations } from "next-intl";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { Switch } from "@/components/ui/switch";

interface Props {
    department: Department | null;
    refresh: () => void;
    onClose: () => void;
}

export default function DepartmentDetailForm({ department, refresh, onClose }: Props) {
    const t = useTranslations('saleOffice');
    const [form, setForm] = useState({
        department_code: "",
        name_th: "",
        name_en: "",
        description: "",
        status: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (department) {
            setForm({
                department_code: department.department_code || "",
                name_th: department.name_th || "",
                name_en: department.name_en || "",
                description: department.description || "",
                status: department.status ?? true
            });
        }
    }, [department]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!department) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/departments/${department.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const errorData = await res.json();

                // Handle error messages as array
                let errorMessage = t('saveError');

                if (res.status === 409 || res.status === 400) {
                    if (errorData.message && Array.isArray(errorData.message)) {
                        const translatedMessages = errorData.message.map((msg: string) => {
                            switch (msg) {
                                case 'Department code already exists in this sale office':
                                    return t('departmentCodeExistsInSaleOffice');
                                default:
                                    return msg;
                            }
                        });
                        errorMessage = translatedMessages.join(', ');
                    } else {
                        errorMessage = errorData.message || t('saveError');
                    }
                } else {
                    errorMessage = errorData.message || t('saveError');
                }

                throw new Error(errorMessage);
            }

            refresh();
            onClose();
        } catch (err) {
            console.error('Update department error:', err);
            setError(err instanceof Error ? err.message : t('saveError'));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    if (!department) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{t('editDepartment')}</h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    disabled={loading}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <IconX className="w-4 h-4" />
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-600">{t('departmentCode')}</label>
                    <Input
                        value={form.department_code}
                        onChange={(e) => setForm({ ...form, department_code: e.target.value })}
                        disabled={loading}
                        placeholder={t('departmentCode')}
                        maxLength={50}
                        required
                    />
                    <div className="text-xs text-gray-500">
                        {form.department_code.length}/50 ตัวอักษร
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-600">{t('nameThai')}</label>
                    <Input
                        value={form.name_th}
                        onChange={(e) => setForm({ ...form, name_th: e.target.value })}
                        disabled={loading}
                        placeholder={t('nameThai')}
                        maxLength={50}
                        required
                    />
                    <div className="text-xs text-gray-500">
                        {form.name_th.length}/50 ตัวอักษร
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-600">{t('nameEnglish')}</label>
                    <Input
                        value={form.name_en}
                        onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                        disabled={loading}
                        placeholder={t('nameEnglish')}
                        maxLength={50}
                        required
                    />
                    <div className="text-xs text-gray-500">
                        {form.name_en.length}/50 ตัวอักษร
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-600">{t('description')}</label>
                    <textarea
                        className="w-full border rounded px-2 py-1 min-h-[80px] resize-y"
                        rows={3}
                        value={form.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })}
                        disabled={loading}
                        placeholder={t('description')}
                        maxLength={100}
                    />
                    <div className="text-xs text-gray-500">
                        {form.description.length}/100 ตัวอักษร
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{t('status')}</span>
                    <Switch
                        checked={form.status}
                        onCheckedChange={(checked) => setForm({ ...form, status: checked })}
                        disabled={loading}
                    />
                    <span className="text-sm text-gray-600">
                        {form.status ? t('active') : t('inactive')}
                    </span>
                </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose} disabled={loading}>
                    {t('cancel')}
                </Button>
                <Button variant="default" onClick={handleSubmit} disabled={loading}>
                    <IconDeviceFloppy /> {loading ? t('saving') : t('save')}
                </Button>
            </div>
        </div>
    );
}
