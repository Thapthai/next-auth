'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface CreateSaleOfficeGroupTypeFormProps {
    isVisible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function CreateSaleOfficeGroupTypeForm({
    isVisible,
    onClose,
    onSuccess,
    onStart,
    onError
}: CreateSaleOfficeGroupTypeFormProps) {
    const t = useTranslations('SaleOfficeGroupTypes');
    const [form, setForm] = useState({
        level: '',
        group: '',
        type: '',
        status: true
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        if (onStart) onStart();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-office-group-types`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error('Failed to create sale office group type');
            }

            // สร้างสำเร็จ - รีเซ็ตฟอร์ม
            setForm({
                level: '',
                group: '',
                type: '',
                status: true
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Create sale office group type error:', err);
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setForm({
                level: '',
                group: '',
                type: '',
                status: true
            });
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{t('createNewSaleOfficeGroupType')}</h2>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-gray-600">{t('level')}</label>
                    <Input
                        value={form.level}
                        onChange={(e) => setForm({ ...form, level: e.target.value })}
                        disabled={loading}
                        placeholder={t('level')}
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('group')}</label>
                    <Input
                        value={form.group}
                        onChange={(e) => setForm({ ...form, group: e.target.value })}
                        disabled={loading}
                        placeholder={t('group')}
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('type')}</label>
                    <Input
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        disabled={loading}
                        placeholder={t('type')}
                    />
                </div>

                <div className="flex items-center justify-between md:col-span-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                            {t('status')}
                        </span>
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
            </div>

            <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose} disabled={loading}>
                    {t('cancel')}
                </Button>
                <Button variant="default" onClick={handleSubmit} disabled={loading}>
                    {loading ? t('saving') : t('save')}
                </Button>
            </div>
        </div>
    );
}