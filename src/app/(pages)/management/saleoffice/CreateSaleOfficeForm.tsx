'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface CreateSaleOfficeFormProps {
    isVisible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function CreateSaleOfficeForm({ isVisible, onClose, onSuccess, onStart, onError }: CreateSaleOfficeFormProps) {
    const t = useTranslations('saleOffice');
    
    const [formData, setFormData] = useState({
        site_code: '',
        site_office_name_th: '',
        site_office_name_en: '',
        address: '',
        phone: '',
        email: ''
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || t('createError'));
            }

            // สร้างสำเร็จ
            setFormData({
                site_code: '',
                site_office_name_th: '',
                site_office_name_en: '',
                address: '',
                phone: '',
                email: ''
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Create sale office error:', err);
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
                site_code: '',
                site_office_name_th: '',
                site_office_name_en: '',
                address: '',
                phone: '',
                email: ''
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
                        <Label htmlFor="site_code" className="text-sm text-gray-600">{t('siteCode')} *</Label>
                        <Input
                            id="site_code"
                            name="site_code"
                            value={formData.site_code}
                            onChange={handleInputChange}
                            placeholder={t('siteCodePlaceholder')}
                            required
                            disabled={loading}
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm text-gray-600">{t('phone')}</Label>
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
                        <Label htmlFor="site_office_name_th" className="text-sm text-gray-600">{t('nameThaiLabel')} *</Label>
                        <Input
                            id="site_office_name_th"
                            name="site_office_name_th"
                            value={formData.site_office_name_th}
                            onChange={handleInputChange}
                            placeholder={t('nameThaiPlaceholder')}
                            required
                            disabled={loading}
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="site_office_name_en" className="text-sm text-gray-600">{t('nameEnglishLabel')} *</Label>
                        <Input
                            id="site_office_name_en"
                            name="site_office_name_en"
                            value={formData.site_office_name_en}
                            onChange={handleInputChange}
                            placeholder={t('nameEnglishPlaceholder')}
                            required
                            disabled={loading}
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email" className="text-sm text-gray-600">{t('email')}</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder={t('emailPlaceholder')}
                            disabled={loading}
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address" className="text-sm text-gray-600">{t('address')}</Label>
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