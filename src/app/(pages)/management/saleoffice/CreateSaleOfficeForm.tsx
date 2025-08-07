'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";

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
        sale_office_code: '',
        name_th: '',
        name_en: '',
        site_path: '',
        lab_site_code: '',
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
                sale_office_code: '',
                name_th: '',
                name_en: '',
                site_path: '',
                lab_site_code: '',
                status: true
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
                sale_office_code: '',
                name_th: '',
                name_en: '',
                site_path: '',
                lab_site_code: '',
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

                    {/* sale_office_code */}
                    <div className="space-y-2">
                        <Label htmlFor="sale_office_code" className="text-sm text-gray-600">{t('saleOfficeCode')} *</Label>
                        <Input
                            id="sale_office_code"
                            name="sale_office_code"
                            value={formData.sale_office_code}
                            onChange={handleInputChange}
                            placeholder={t('saleOfficeCodePlaceholder')}
                            required
                            disabled={loading}
                            maxLength={50}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {formData.sale_office_code.length}/50 ตัวอักษร
                        </div>
                    </div>

                    {/* name_th */}
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
                            maxLength={50}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {formData.name_th.length}/50 ตัวอักษร
                        </div>
                    </div>

                    {/* name_en */}
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
                            maxLength={50}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {formData.name_en.length}/50 ตัวอักษร
                        </div>
                    </div>

                    {/* site_path */}
                    <div className="space-y-2">
                        <Label htmlFor="site_path" className="text-sm text-gray-600">{t('sitePath')} *</Label>
                        <Input
                            id="site_path"
                            name="site_path"
                            value={formData.site_path}
                            onChange={handleInputChange}
                            placeholder={t('sitePathPlaceholder')}
                            required
                            disabled={loading}
                            maxLength={50}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {formData.site_path.length}/50 ตัวอักษร
                        </div>
                    </div>

                    {/* lab_site_code */}
                    <div className="space-y-2">
                        <Label htmlFor="lab_site_code" className="text-sm text-gray-600">{t('labSiteCode')} *</Label>
                        <Input
                            id="lab_site_code"
                            name="lab_site_code"
                            value={formData.lab_site_code}
                            onChange={handleInputChange}
                            placeholder={t('labSiteCodePlaceholder')}
                            required
                            disabled={loading}
                            maxLength={50}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {formData.lab_site_code.length}/50 ตัวอักษร
                        </div>
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