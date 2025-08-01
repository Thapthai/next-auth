'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface CreateFactoryFormProps {
    isVisible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function CreateFactoryForm({ isVisible, onClose, onSuccess, onStart, onError }: CreateFactoryFormProps) {
    const t = useTranslations('Factories');

    const [formData, setFormData] = useState({
        name_th: '',
        name_en: '',
        address: '',
        phone: '',
        tax_id: '',
        description: '',
        status: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Call onStart callback
        if (onStart) onStart();

        try {
            // Convert form data to match DTO requirements
            const submitData = {
                name_th: formData.name_th,
                name_en: formData.name_en,
                address: formData.address,
                phone: formData.phone,
                description: formData.description,
                status: formData.status
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/factories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || t('createError'));
            }

            // สร้างสำเร็จ
            setFormData({
                name_th: '',
                name_en: '',
                address: '',
                phone: '',
                tax_id: '',
                description: '',
                status: true
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Create factory error:', err);
            setError(err instanceof Error ? err.message : t('createError'));
            // Call onError callback
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({
                name_th: '',
                name_en: '',
                address: '',
                phone: '',
                tax_id: '',
                description: '',
                status: true
            });
            setError(null);
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{t('createTitle')}</h2>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name_th" className="text-sm text-gray-600">{t('nameThaiLabel')} *</Label>
                        <Input
                            id="name_th"
                            name="name_th"
                            value={formData.name_th}
                            onChange={handleInputChange}
                            placeholder={t('nameThaiPlaceholder')}
                            required
                            disabled={loading}
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name_en" className="text-sm text-gray-600">{t('nameEnglishLabel')} *</Label>
                        <Input
                            id="name_en"
                            name="name_en"
                            value={formData.name_en}
                            onChange={handleInputChange}
                            placeholder={t('nameEnglishPlaceholder')}
                            required
                            disabled={loading}
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm text-gray-600">{t('phoneLabel')}</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder={t('phonePlaceholder')}
                            disabled={loading}
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>



                    <div className="space-y-2">
                        <Label htmlFor="tax_id" className="text-sm text-gray-600">{t('taxIdLabel')}</Label>
                        <Input
                            id="description"
                            name="description"
                            type="text"
                            value={formData.tax_id}
                            onChange={handleInputChange}
                            placeholder={t('taxIdPlaceholder')}
                            disabled={loading}
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm text-gray-600">{t('descriptionLabel')}</Label>
                        <Input
                            id="description"
                            name="description"
                            type="text"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder={t('descriptionPlaceholder')}
                            disabled={loading}
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address" className="text-sm text-gray-600">{t('addressLabel')}</Label>
                        <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder={t('addressPlaceholder')}
                            disabled={loading}
                            className="w-full border rounded px-2 py-1"
                        />
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
                                {t('creating')}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <IconDeviceFloppy className="w-4 h-4" />
                                {t('createButton')}
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
} 