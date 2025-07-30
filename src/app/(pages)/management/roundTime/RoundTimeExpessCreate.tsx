'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { SaleOffice } from "@/types/saleOffice";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface RoundTimeExpressCreateProps {
    isVisible: boolean;
    saleOfficeData: SaleOffice[];
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function RoundTimeExpressCreate({ 
    isVisible, 
    saleOfficeData, 
    onClose, 
    onSuccess, 
    onStart, 
    onError 
}: RoundTimeExpressCreateProps) {
    const t = useTranslations('roundTime');
    const [form, setForm] = useState({
        sale_office_id: 0,
        time: '',
        status: true
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        if (onStart) onStart();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/round-time-express`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error('Failed to create round time express');
            }

            // สร้างสำเร็จ - รีเซ็ตฟอร์ม
            setForm({
                sale_office_id: 0,
                time: '',
                status: true
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Create round time dirty error:', err);
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setForm({
                sale_office_id: 0,
                time: '',
                status: true
            });
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{t('roundTimeExpress.createNewItem')}</h2>
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
                    <label className="text-sm text-gray-600">{t('roundTimeExpress.saleOfficeId')}</label>
                    <Select
                        value={form.sale_office_id.toString()}
                        onValueChange={(value) => setForm({ ...form, sale_office_id: parseInt(value) || 0 })}
                        disabled={loading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('roundTimeExpress.selectSaleOffice')} />
                        </SelectTrigger>
                        <SelectContent>
                            {saleOfficeData.map((office) => (
                                <SelectItem key={office.id} value={office.id.toString()}>
                                    {office.site_code} - {office.site_office_name_th}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-sm text-gray-600">{t('roundTimeExpress.time')}</label>
                    <input
                        type="time"
                        className="w-full border rounded px-2 py-1"
                        value={form.time}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                        disabled={loading}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                            {t('roundTimeExpress.status')} 
                        </span>
                        <Switch
                            checked={form.status}
                            onCheckedChange={(checked) => setForm({ ...form, status: checked })}
                            disabled={loading}
                        />
                        {form.status ? t('roundTimeExpress.active') : t('roundTimeExpress.inactive')}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose} disabled={loading}>
                    {t('roundTimeExpress.cancel')}
                </Button>
                <Button variant="default" onClick={handleSubmit} disabled={loading}>
                    {loading ? t('roundTimeExpress.saving') : t('roundTimeExpress.save')}
                </Button>
            </div>
        </div>
    );
}
