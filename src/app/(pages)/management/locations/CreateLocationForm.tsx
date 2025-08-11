'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface CreateLocationFormProps {
    isVisible: boolean;
    stockLocationData: any[];
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function CreateLocationForm({
    isVisible,
    stockLocationData,
    onClose,
    onSuccess,
    onStart,
    onError
}: CreateLocationFormProps) {
    const t = useTranslations('Locations');
    const [form, setForm] = useState({
        stock_location_id: 0,
        site_short_code: '',
        description: '',
        status: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);



    // Handle stock location change
    const handleStockLocationChange = (value: string) => {
        const stockLocationId = parseInt(value) || 0;
        setForm({
            ...form,
            stock_location_id: stockLocationId
        });
    };



    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        if (onStart) onStart();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/locations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const errorData = await res.json();
                let errorMessage = t('createError');

                if (res.status === 409 || res.status === 400) {
                    if (errorData.message && Array.isArray(errorData.message)) {
                        const translatedMessages = errorData.message.map((msg: string) => {
                            switch (msg) {
                                case 'Site short code already exists in this stock location': return t('siteShortCodeExists');
                                case 'Site short code must not exceed 50 characters': return t('siteShortCodeTooLong');
                                case 'Description must not exceed 200 characters': return t('descriptionTooLong');
                                default: return msg;
                            }
                        });
                        errorMessage = translatedMessages.join(', ');
                    } else {
                        errorMessage = errorData.message || t('createError');
                    }
                }

                throw new Error(errorMessage);
            }

            // สร้างสำเร็จ - รีเซ็ตฟอร์ม
            setForm({
                stock_location_id: 0,
                site_short_code: '',
                description: '',
                status: true
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Create location error:', err);
            setError(err instanceof Error ? err.message : t('createError'));
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setForm({
                stock_location_id: 0,
                site_short_code: '',
                description: '',
                status: true
            });
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{t('createNewLocation')}</h2>
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
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-2">
                    <label className="text-sm text-gray-600">{t('site_short_code')}</label>
                    <Input
                        value={form.site_short_code}
                        onChange={(e) => setForm({ ...form, site_short_code: e.target.value })}
                        disabled={loading}
                        placeholder={t('site_short_code')}
                        required
                        maxLength={50}
                    />
                    <div className="text-xs text-gray-500">
                        {form.site_short_code.length}/50 ตัวอักษร
                    </div>
                </div>



                <div className="space-y-2">
                    <label className="text-sm text-gray-600">{t('stockLocation')}</label>
                    <Select
                        value={form.stock_location_id.toString()}
                        onValueChange={handleStockLocationChange}
                        disabled={loading}
                        required
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('selectStockLocation')} />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {stockLocationData.map((stockLocation) => (
                                <SelectItem key={stockLocation.id} value={stockLocation.id.toString()}>
                                    {stockLocation.site_short_code} - {stockLocation.description || '-'} ({stockLocation.sale_office.sale_office_code})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>



                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm text-gray-600">{t('description')}</label>
                    <Input
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        disabled={loading}
                        placeholder={t('description')}
                        maxLength={100}
                    />
                    <div className="text-xs text-gray-500">
                        {form.description.length}/100 ตัวอักษร
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
