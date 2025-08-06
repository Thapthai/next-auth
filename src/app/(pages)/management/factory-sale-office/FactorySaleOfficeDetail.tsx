'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { FactorySaleOffice } from "@/types/factorySaleOffice";

interface FactorySaleOfficeDetailProps {
    isVisible: boolean;
    factorySaleOffice: FactorySaleOffice | null;
    saleOffices: SaleOffice[];
    factories: Factory[];
    loadingMasterData: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

interface SaleOffice {
    id: number;
    site_office_name_th: string;
    site_office_name_en: string;
    site_code: string;
}

interface Factory {
    id: number;
    name_th: string;
    name_en: string;
}

export default function FactorySaleOfficeDetail({ isVisible, factorySaleOffice, saleOffices, factories, loadingMasterData, onClose, onSuccess, onStart, onError }: FactorySaleOfficeDetailProps) {
    const t = useTranslations('FactorySaleOffice.Detail');

    const [formData, setFormData] = useState({
        sale_office_id: '',
        factory_id: '',
        status: true
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load factory sale office data when prop changes AND master data is ready
    useEffect(() => {
        if (factorySaleOffice && !loadingMasterData && saleOffices.length > 0 && factories.length > 0) {
            const newFormData = {
                sale_office_id: factorySaleOffice.sale_office_id.toString(),
                factory_id: factorySaleOffice.factory_id.toString(),
                status: factorySaleOffice.status ?? true
            };
            setFormData(newFormData);
        }
    }, [factorySaleOffice, loadingMasterData, saleOffices, factories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!factorySaleOffice) return;

        setLoading(true);
        setError(null);

        // Call onStart callback
        if (onStart) onStart();

        try {
            // Convert form data to match DTO requirements
            const submitData = {
                sale_office_id: parseInt(formData.sale_office_id),
                factory_id: parseInt(formData.factory_id),
                status: formData.status
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/factory-sale-office/${factorySaleOffice.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || t('editError'));
            }

            // แก้ไขสำเร็จ
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Edit factory sale office error:', err);
            setError(err instanceof Error ? err.message : t('editError'));
            // Call onError callback
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setError(null);
            onClose();
        }
    };

    if (!isVisible || !factorySaleOffice) return null;

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
                    <div className="space-y-2">
                        <Label htmlFor="edit_sale_office_id" className="text-sm text-gray-600">{t('saleOffice')} *</Label>
                        <Select
                            key={`sale-office-${factorySaleOffice?.id}-${formData.sale_office_id}`}
                            value={formData.sale_office_id}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, sale_office_id: value }))}
                            disabled={loading || loadingMasterData}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={loadingMasterData ? "กำลังโหลด..." : t('selectSaleOffice')} />
                            </SelectTrigger>
                            <SelectContent>
                                {saleOffices.map((office) => (
                                    <SelectItem key={office.id} value={office.id.toString()}>
                                        {office.site_code} - {office.site_office_name_th}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit_factory_id" className="text-sm text-gray-600">{t('factory')} *</Label>
                        <Select
                            key={`factory-${factorySaleOffice?.id}-${formData.factory_id}`}
                            value={formData.factory_id}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, factory_id: value }))}
                            disabled={loading || loadingMasterData}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={loadingMasterData ? "กำลังโหลด..." : t('selectFactory')} />
                            </SelectTrigger>
                            <SelectContent>
                                {factories.map((factory) => (
                                    <SelectItem key={factory.id} value={factory.id.toString()}>
                                        {factory.name_th}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2 md:col-span-2">
                        <span className="text-sm text-gray-600">{t('status')}</span>
                        <Switch
                            checked={formData.status}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked }))}
                            disabled={loading}
                        />
                        <span className="text-sm text-gray-600">
                            {formData.status ? t('active') : t('inactive')}
                        </span>
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
                        disabled={loading || !formData.sale_office_id || !formData.factory_id}
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