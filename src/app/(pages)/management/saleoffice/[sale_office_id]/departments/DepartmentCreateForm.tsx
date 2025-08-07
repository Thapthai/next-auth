'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

interface CreateDepartmentFormProps {
    isVisible: boolean;
    saleOfficeId?: number;
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function CreateDepartmentForm({
    isVisible,
    saleOfficeId,
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

    const handleSubmit = async () => {
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

            <div className="space-y-2">
                <div>
                    <label className="text-sm text-gray-600">{t('departmentCode')}</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.department_code}
                        onChange={(e) => setForm({ ...form, department_code: e.target.value })}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">{t('nameThai')}</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.name_th}
                        onChange={(e) => setForm({ ...form, name_th: e.target.value })}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">{t('nameEnglish')}</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.name_en}
                        onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">{t('description')}</label>
                    <textarea
                        className="w-full border rounded px-2 py-1"
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        disabled={loading}
                    />
                </div>

            </div>

            <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={onClose} disabled={loading}>
                    {t('cancel')}
                </Button>
                <Button variant="default" onClick={handleSubmit} disabled={loading}>
                    {loading ? t('saving') : t('save')}
                </Button>
            </div>
        </div>
    );
} 