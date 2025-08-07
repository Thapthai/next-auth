'use client';

import { useEffect, useState } from "react";
import { SaleOffice } from "@/types/saleOffice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";

type Props = {
    saleOffice: SaleOffice | null;
    refresh: () => void;
    onClose: () => void;
};

export default function SaleOfficeDetail({ saleOffice, refresh, onClose }: Props) {
    const t = useTranslations('saleOffice');
    const [form, setForm] = useState({
        sale_office_code: "",
        name_th: "",
        name_en: "",
        site_path: "",
        lab_site_code: "",
        status: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (saleOffice) {
            setForm({
                sale_office_code: saleOffice.sale_office_code || "",
                name_th: saleOffice.name_th || "",
                name_en: saleOffice.name_en || "",
                site_path: saleOffice.site_path || "",
                lab_site_code: saleOffice.lab_site_code || "",
                status: saleOffice.status ?? true,
            });
        }
    }, [saleOffice]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!saleOffice) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices/${saleOffice.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const errorData = await res.json();

                // Handle different error responses
                let errorMessage = t('saveError');

                if (res.status === 409 || res.status === 400) {
                    // Handle error messages as array
                    if (errorData.message && Array.isArray(errorData.message)) {
                        const translatedMessages = errorData.message.map((msg: string) => {
                            // Map specific error keys to translation keys
                            switch (msg) {
                                case 'Sale office code already exists':
                                    return t('saleOfficeCodeExists');
                                case 'Site path already exists':
                                    return t('sitePathExists');
                                case 'Lab site code already exists':
                                    return t('labSiteCodeExists');
                                case 'Sale office code must not exceed 50 characters':
                                    return t('saleOfficeCodeTooLong');
                                case 'Thai name must not exceed 50 characters':
                                    return t('nameThTooLong');
                                case 'English name must not exceed 50 characters':
                                    return t('nameEnTooLong');
                                case 'Site path must not exceed 50 characters':
                                    return t('sitePathTooLong');
                                case 'Lab site code must not exceed 50 characters':
                                    return t('labSiteCodeTooLong');
                                default:
                                    return msg; // Return original message if no translation found
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
            console.error('Update sale office error:', err);
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


    if (!saleOffice) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{t('editTitle')}</h2>
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
                            value={form.sale_office_code}
                            onChange={handleInputChange}
                            placeholder={t('saleOfficeCodePlaceholder')}
                            required
                            disabled={loading}
                            maxLength={50}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.sale_office_code.length}/50 ตัวอักษร
                        </div>
                    </div>

                    {/* name_th */}
                    <div className="space-y-2">
                        <Label htmlFor="name_th" className="text-sm text-gray-600">{t('nameThaiLabel')} *</Label>
                        <Input
                            id="name_th"
                            name="name_th"
                            value={form.name_th}
                            onChange={handleInputChange}
                            placeholder={t('nameThaiPlaceholder')}
                            required
                            disabled={loading}
                            maxLength={50}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.name_th.length}/50 ตัวอักษร
                        </div>
                    </div>

                    {/* name_en */}
                    <div className="space-y-2">
                        <Label htmlFor="name_en" className="text-sm text-gray-600">{t('nameEnglishLabel')} *</Label>
                        <Input
                            id="name_en"
                            name="name_en"
                            value={form.name_en}
                            onChange={handleInputChange}
                            placeholder={t('nameEnglishPlaceholder')}
                            required
                            disabled={loading}
                            maxLength={50}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.name_en.length}/50 ตัวอักษร
                        </div>
                    </div>

                    {/* site_path */}
                    <div className="space-y-2">
                        <Label htmlFor="site_path" className="text-sm text-gray-600">{t('sitePath')} *</Label>
                        <Input
                            id="site_path"
                            name="site_path"
                            value={form.site_path}
                            onChange={handleInputChange}
                            placeholder={t('sitePathPlaceholder')}
                            required
                            disabled={loading}
                            maxLength={50}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.site_path.length}/50 ตัวอักษร
                        </div>
                    </div>

                    {/* lab_site_code */}
                    <div className="space-y-2">
                        <Label htmlFor="lab_site_code" className="text-sm text-gray-600">{t('labSiteCode')} *</Label>
                        <Input
                            id="lab_site_code"
                            name="lab_site_code"
                            value={form.lab_site_code}
                            onChange={handleInputChange}
                            placeholder={t('labSiteCodePlaceholder')}
                            required
                            disabled={loading}
                            maxLength={50}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.lab_site_code.length}/50 ตัวอักษร
                        </div>
                    </div>

                    {/* status */}
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="status" className="text-sm text-gray-600">{t('status')}</Label>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="status"
                                name="status"
                                onCheckedChange={(checked) => setForm({ ...form, status: checked })}
                                disabled={loading}
                                checked={form.status}
                            />
                            <span className="text-sm text-gray-600">
                                {form.status ? t('active') : t('inactive')}
                            </span>
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
