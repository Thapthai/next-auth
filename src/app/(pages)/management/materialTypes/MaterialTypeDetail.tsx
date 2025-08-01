'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { MaterialType } from "@/types/materialType";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface MaterialTypeDetailProps {
    materialType: MaterialType;
    isVisible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function MaterialTypeDetail({
    materialType,
    isVisible,
    onClose,
    onSuccess,
    onStart,
    onError
}: MaterialTypeDetailProps) {
    const t = useTranslations('MaterialTypes');
    const [form, setForm] = useState({
        name_th: '',
        name_en: '',
        description: '',
        status: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (materialType) {
            setForm({
                name_th: materialType.name_th || '',
                name_en: materialType.name_en || '',
                description: materialType.description || '',
                status: materialType.status ?? true
            });
        }
    }, [materialType]);

    const handleSubmit = async () => {
        setLoading(true);
        if (onStart) onStart();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/material-types/${materialType.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            
            if (!res.ok) {
                throw new Error('Failed to update material type');
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Update material type error:', err);
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{t('edit')}</h2>
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
            <div className="space-y-2">
                <div>
                    <label className="text-sm text-gray-600">{t('nameThai')}</label>
                    <Input 
                        value={form.name_th} 
                        onChange={(e) => setForm({ ...form, name_th: e.target.value })} 
                        disabled={loading}
                    />
                </div>
                
                <div>
                    <label className="text-sm text-gray-600">{t('nameEnglish')}</label>
                    <Input 
                        value={form.name_en} 
                        onChange={(e) => setForm({ ...form, name_en: e.target.value })} 
                        disabled={loading}
                    />
                </div>
                
                <div>
                    <label className="text-sm text-gray-600">{t('description')}</label>
                    <Input 
                        value={form.description} 
                        onChange={(e) => setForm({ ...form, description: e.target.value })} 
                        disabled={loading}
                    />
                </div>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                            {t('status')} 
                        </span>
                        <Switch
                            checked={form.status}
                            onCheckedChange={(checked) => setForm({ ...form, status: checked })}
                            disabled={loading}
                        />
                        {form.status ? t('active') : t('inactive')}
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