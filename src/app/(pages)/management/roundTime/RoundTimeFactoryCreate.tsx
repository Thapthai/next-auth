'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Factories } from "@/types/factories";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface RoundTimeFactoryCreateProps {
    isVisible: boolean;
    factoryData: Factories[];
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function RoundTimeFactoryCreate({ 
    isVisible, 
    factoryData, 
    onClose, 
    onSuccess, 
    onStart, 
    onError 
}: RoundTimeFactoryCreateProps) {
    const t = useTranslations('roundTime');
    const [form, setForm] = useState({
        factory_id: 0,
        time: '',
        status: true
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        if (onStart) onStart();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/round-time-factory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error('Failed to create round time factory');
            }

            // สร้างสำเร็จ - รีเซ็ตฟอร์ม
            setForm({
                factory_id: 0,
                time: '',
                status: true
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Create round time factory error:', err);
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setForm({
                factory_id: 0,
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
                <h2 className="text-lg font-bold text-gray-800">{t('roundTimeFactory.createNewItem')}</h2>
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
                    <label className="text-sm text-gray-600">{t('roundTimeFactory.factoryId')}</label>
                    <Select
                        value={form.factory_id.toString()}
                        onValueChange={(value) => setForm({ ...form, factory_id: parseInt(value) || 0 })}
                        disabled={loading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('roundTimeFactory.selectFactory')} />
                        </SelectTrigger>
                        <SelectContent>
                            {factoryData.map((factory) => (
                                <SelectItem key={factory.id} value={factory.id.toString()}>
                                    {factory.name_th} - {factory.name_en}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-sm text-gray-600">{t('roundTimeFactory.time')}</label>
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
                            {t('roundTimeFactory.status')} 
                        </span>
                        <Switch
                            checked={form.status}
                            onCheckedChange={(checked) => setForm({ ...form, status: checked })}
                            disabled={loading}
                        />
                        {form.status ? t('roundTimeFactory.active') : t('roundTimeFactory.inactive')}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose} disabled={loading}>
                    {t('roundTimeFactory.cancel')}
                </Button>
                <Button variant="default" onClick={handleSubmit} disabled={loading}>
                    {loading ? t('roundTimeFactory.saving') : t('roundTimeFactory.save')}
                </Button>
            </div>
        </div>
    );
}