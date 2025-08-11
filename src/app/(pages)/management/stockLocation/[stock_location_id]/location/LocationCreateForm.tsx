'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconX, IconDeviceFloppy } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";

interface CreateLocationFormProps {
    isVisible: boolean;
    stockLocationId?: number;
    refresh: () => void;
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function CreateLocationForm({
    isVisible,
    stockLocationId,
    refresh,
    onClose,
    onSuccess,
    onStart,
    onError
}: CreateLocationFormProps) {
    const t = useTranslations('Locations');
    const [form, setForm] = useState({
        site_short_code: '',
        description: '',
        stock_location_id: stockLocationId || 0,
        status: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (onStart) onStart();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/locations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    site_short_code: form.site_short_code,
                    stock_location_id: stockLocationId,
                    description: form.description,
                    status: form.status
                }),
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
                site_short_code: '',
                description: '',
                stock_location_id: stockLocationId || 0,
                status: true
            });

            refresh();
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
                site_short_code: '',
                description: '',
                stock_location_id: stockLocationId || 0,
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

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
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

                <div className="flex justify-end gap-2">
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
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('saving')}
                            </>
                        ) : (
                            <>
                                <IconDeviceFloppy className="mr-2 h-4 w-4" />
                                {t('save')}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
