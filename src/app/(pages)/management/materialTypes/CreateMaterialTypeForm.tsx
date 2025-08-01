'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface CreateMaterialTypeFormProps {
    isVisible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function CreateMaterialTypeForm({ isVisible, onClose, onSuccess, onStart, onError }: CreateMaterialTypeFormProps) {
    const t = useTranslations('MaterialTypes');
    const [form, setForm] = useState({
        name_th: '',
        name_en: '',
        description: '',
        status: true
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        if (onStart) onStart();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/material-types`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error('Failed to create');

            setForm({ name_th: '', name_en: '', description: '', status: true });
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">{t('createNewMaterialType')}</h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                    <IconX className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">{t('nameThai')} *</label>
                    <Input
                        value={form.name_th}
                        onChange={(e) => setForm({ ...form, name_th: e.target.value })}
                        placeholder={t('nameThaiPlaceholder')}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">{t('nameEnglish')} *</label>
                    <Input
                        value={form.name_en}
                        onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                        placeholder={t('nameEnglishPlaceholder')}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-sm font-medium">{t('description')} *</label>
                    <Input
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder={t('descriptionPlaceholder')}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">{t('status')}</label>
                    <div className="flex items-center gap-2 mt-1">
                        <Switch
                            checked={form.status}
                            onCheckedChange={(checked) => setForm({ ...form, status: checked })}
                        />
                        <span>{form.status ? t('active') : t('inactive')}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>{t('cancel')}</Button>
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? t('saving') : t('create')}
                </Button>
            </div>
        </div>
    );
}