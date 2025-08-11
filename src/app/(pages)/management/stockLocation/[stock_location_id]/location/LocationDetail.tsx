'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconX, IconDeviceFloppy, IconTrash } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Location } from "@/types/location";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface LocationDetailProps {
    location: Location;
    isVisible: boolean;
    stockLocationId?: number;
    refresh: () => void;
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function LocationDetailForm({
    location,
    isVisible,
    stockLocationId,
    refresh,
    onClose,
    onSuccess,
    onStart,
    onError
}: LocationDetailProps) {
    const t = useTranslations('Locations');
    const [form, setForm] = useState({
        site_short_code: '',
        description: '',
        stock_location_id: stockLocationId || 0,
        status: true
    });
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (location) {
            setForm({
                site_short_code: location.site_short_code || '',
                description: location.description || '',
                stock_location_id: location.stock_location_id || stockLocationId || 0,
                status: location.status ?? true
            });
        }
    }, [location, stockLocationId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (onStart) onStart();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/locations/${location.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    site_short_code: form.site_short_code,
                    stock_location_id: form.stock_location_id,
                    description: form.description,
                    status: form.status
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                let errorMessage = t('saveError');

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
                        errorMessage = errorData.message || t('saveError');
                    }
                }

                throw new Error(errorMessage);
            }

            refresh();
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Update location error:', err);
            setError(err instanceof Error ? err.message : t('saveError'));
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(t('confirmDelete'))) return;

        setDeleteLoading(true);
        setError(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/locations/${location.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || t('deleteError'));
            }

            refresh();
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Delete location error:', err);
            setError(err instanceof Error ? err.message : t('deleteError'));
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading && !deleteLoading) {
            setError(null);
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{t('editLocation')}</h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    disabled={loading || deleteLoading}
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
                <div className="space-y-2 md:col-span-2">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-600">{t('site_short_code')}</label>
                        <Input
                            value={form.site_short_code}
                            onChange={(e) => setForm({ ...form, site_short_code: e.target.value })}
                            disabled={loading || deleteLoading}
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
                            disabled={loading || deleteLoading}
                            placeholder={t('description')}
                            maxLength={100}
                        />
                        <div className="text-xs text-gray-500">
                            {form.description.length}/100 ตัวอักษร
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{t('status')}</span>
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



                <div className="mt-4 flex justify-end gap-2">

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading || deleteLoading}
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading || deleteLoading}
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
            </form >
        </div >
    );
}
