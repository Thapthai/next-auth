'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Material } from "@/types/material";
import { MaterialType } from "@/types/materialType";
import { SapSale } from "@/types/sapSale";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface MaterialDetailProps {
    material: Material;
    isVisible: boolean;
    materialTypeData: MaterialType[];
    sapSaleData: SapSale[];
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function MaterialDetail({
    material,
    isVisible,
    materialTypeData,
    sapSaleData,
    onClose,
    onSuccess,
    onStart,
    onError
}: MaterialDetailProps) {
    const t = useTranslations('Materials');
    const [form, setForm] = useState({
        material_code: '',
        material_name_th: '',
        material_name_en: '',
        long_meterial_name: '',
        material_type_id: 0,
        sap_sale_id: null as number | null,
        description: '',
        status: true
    });
    const [loading, setLoading] = useState(false);

    // อัปเดตฟอร์มเมื่อ material เปลี่ยน
    useEffect(() => {
        if (material) {
            setForm({
                material_code: material.material_code || '',
                material_name_th: material.material_name_th || '',
                material_name_en: material.material_name_en || '',
                long_meterial_name: material.long_meterial_name || '',
                material_type_id: material.material_type_id || 0,
                sap_sale_id: material.sap_sale_id || null,
                description: material.description || '',
                status: material.status ?? true
            });
        }
    }, [material]);

    const handleSubmit = async () => {
        setLoading(true);
        if (onStart) onStart();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/materials/${material.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error('Failed to update material');
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Update material error:', err);
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{t('editItem')}</h2>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-gray-600">{t('materialCode')}</label>
                    <Input
                        value={form.material_code}
                        onChange={(e) => setForm({ ...form, material_code: e.target.value })}
                        disabled={loading}
                        placeholder={t('materialCode')}
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('materialNameTh')}</label>
                    <Input
                        value={form.material_name_th}
                        onChange={(e) => setForm({ ...form, material_name_th: e.target.value })}
                        disabled={loading}
                        placeholder={t('materialNameTh')}
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('materialNameEn')}</label>
                    <Input
                        value={form.material_name_en}
                        onChange={(e) => setForm({ ...form, material_name_en: e.target.value })}
                        disabled={loading}
                        placeholder={t('materialNameEn')}
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('longMaterialName')}</label>
                    <Input
                        value={form.long_meterial_name}
                        onChange={(e) => setForm({ ...form, long_meterial_name: e.target.value })}
                        disabled={loading}
                        placeholder={t('longMaterialName')}
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('materialType')}</label>
                    <Select
                        value={form.material_type_id.toString()}
                        onValueChange={(value) => setForm({ ...form, material_type_id: parseInt(value) || 0 })}
                        disabled={loading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('materialType')} />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {materialTypeData.map((type) => (
                                <SelectItem key={type.id} value={type.id.toString()}>
                                    {type.description}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('sapSale')}</label>
                    <Select
                        value={form.sap_sale_id?.toString() || ''}
                        onValueChange={(value) => setForm({ ...form, sap_sale_id: value === "0" ? null : parseInt(value) || null })}
                        disabled={loading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('sapSale')} />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            <SelectItem value="0">{t('none')}</SelectItem>
                            {sapSaleData.map((sale) => (
                                <SelectItem key={sale.id} value={sale.id.toString()}>
                                    {sale.code} - {sale.description}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="md:col-span-2">
                    <label className="text-sm text-gray-600">{t('description')}</label>
                    <Input
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        disabled={loading}
                        placeholder={t('description')}
                    />
                </div>

                <div className="flex items-center justify-between md:col-span-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                            {t('status')}
                        </span>
                        <Switch
                            checked={form.status}
                            onCheckedChange={(checked) => setForm({ ...form, status: checked })}
                            disabled={loading}
                        />
                        {form.status ? t('active') : t('inactive')}
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