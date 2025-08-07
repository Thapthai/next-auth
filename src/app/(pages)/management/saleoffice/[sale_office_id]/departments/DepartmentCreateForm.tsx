'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconX, IconDeviceFloppy } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface CreateDepartmentFormProps {
    isVisible: boolean;
    saleOfficeId?: number;
    refresh: () => void;
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function CreateDepartmentForm({
    isVisible,
    saleOfficeId,
    refresh,
    onClose,
    onSuccess,
    onStart,
    onError
}: CreateDepartmentFormProps) {
    const t = useTranslations('saleOffice');
    const [form, setForm] = useState({
        department_code: '',
        name_th: '',
        name_en: '',
        description: '',
        sale_office_id: saleOfficeId || 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (onStart) onStart();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/departments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    department_code: form.department_code,
                    sale_office_id: saleOfficeId,
                    description: form.description,
                    group_code: 'GR01',
                    ship_id: 10,
                    is_default: true,
                    name_th: form.name_th,
                    name_en: form.name_en,
                    status: true
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || t('createError'));
            }

            // สร้างสำเร็จ - รีเซ็ตฟอร์ม
            setForm({
                department_code: '',
                name_th: '',
                name_en: '',
                description: '',
                sale_office_id: saleOfficeId || 0
            });
            onSuccess();
            refresh();
            onClose();
        } catch (err) {
            console.error('Create department error:', err);
            setError(err instanceof Error ? err.message : t('createError'));
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;
    const handleClose = () => {
        if (!loading) {
            setForm({
                department_code: '',
                name_th: '',
                name_en: '',
                description: '',
                sale_office_id: saleOfficeId || 0
            });
            onClose();
        }
    };

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{t('createDepartment')}</h2>
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

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-600">{t('departmentCode')}</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.department_code}
                        onChange={(e) => setForm({ ...form, department_code: e.target.value })}
                        disabled={loading}
                        maxLength={50}
                        required
                    />
                    <div className="text-xs text-gray-500">
                        {form.department_code.length}/50 ตัวอักษร
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-600">{t('nameThai')}</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.name_th}
                        onChange={(e) => setForm({ ...form, name_th: e.target.value })}
                        disabled={loading}
                        maxLength={50}
                        required
                    />
                    <div className="text-xs text-gray-500">
                        {form.name_th.length}/50 ตัวอักษร
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-600">{t('nameEnglish')}</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.name_en}
                        onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                        disabled={loading}
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
                        className="w-full border rounded px-2 py-1"
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        disabled={loading}
                        maxLength={100}
                    />
                    <div className="text-xs text-gray-500">
                        {form.description.length}/100 ตัวอักษร
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t('saving')}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <IconDeviceFloppy className="w-4 h-4" />
                                {t('save')}
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
} 