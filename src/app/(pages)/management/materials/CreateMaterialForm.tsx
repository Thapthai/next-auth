'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MaterialType } from "@/types/materialType";
import { SapSale } from "@/types/sapSale";

interface CreateMaterialFormProps {
    isVisible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function CreateMaterialForm({ isVisible, onClose, onSuccess, onStart, onError }: CreateMaterialFormProps) {
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
    const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);
    const [sapSales, setSapSales] = useState<SapSale[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(false);

    useEffect(() => {
        const fetchOptions = async () => {
            setLoadingOptions(true);
            try {
                const [materialTypesRes, sapSalesRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/material-types`),
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sap-sale`)
                ]);

                if (materialTypesRes.ok) {
                    const materialTypesData = await materialTypesRes.json();
                    setMaterialTypes(materialTypesData.data || []);
                }

                if (sapSalesRes.ok) {
                    const sapSalesData = await sapSalesRes.json();
                    setSapSales(sapSalesData.data || []);
                }
            } catch (err) {
                console.error('Failed to fetch options:', err);
            } finally {
                setLoadingOptions(false);
            }
        };

        if (isVisible) {
            fetchOptions();
        }
    }, [isVisible]);

    const handleSubmit = async () => {
        setLoading(true);
        if (onStart) onStart();

        try {

            const submitData = {
                ...form,
                sap_sale_id: form.sap_sale_id === 0 ? undefined : form.sap_sale_id
            };


            console.log(submitData);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/materials`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            if (!res.ok) {
                throw new Error('Failed to create material');
            }

            setForm({
                material_code: '',
                material_name_th: '',
                material_name_en: '',
                long_meterial_name: '',
                material_type_id: 0,
                sap_sale_id: 0,
                description: '',
                status: true
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Create material error:', err);
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setForm({
                material_code: '',
                material_name_th: '',
                material_name_en: '',
                long_meterial_name: '',
                material_type_id: 0,
                sap_sale_id: 0,
                description: '',
                status: true
            });
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{t('createNewItem')}</h2>
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
                    <label className="text-sm font-medium text-gray-600">{t('materialCode')} *</label>
                    <Input
                        value={form.material_code}
                        onChange={(e) => setForm({ ...form, material_code: e.target.value })}
                        disabled={loading}
                        placeholder={t('materialCodePlaceholder')}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-600">{t('materialNameTh')} *</label>
                    <Input
                        value={form.material_name_th}
                        onChange={(e) => setForm({ ...form, material_name_th: e.target.value })}
                        disabled={loading}
                        placeholder={t('materialNameThPlaceholder')}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-600">{t('materialNameEn')} *</label>
                    <Input
                        value={form.material_name_en}
                        onChange={(e) => setForm({ ...form, material_name_en: e.target.value })}
                        disabled={loading}
                        placeholder={t('materialNameEnPlaceholder')}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-600">{t('longMaterialName')} *</label>
                    <Input
                        value={form.long_meterial_name}
                        onChange={(e) => setForm({ ...form, long_meterial_name: e.target.value })}
                        disabled={loading}
                        placeholder={t('longMaterialNamePlaceholder')}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-600">
                        {t('materialType')} *
                    </label>
                    <Select
                        value={form.material_type_id.toString()}
                        onValueChange={(value) =>
                            setForm({ ...form, material_type_id: parseInt(value) || 0 })
                        }
                        disabled={loading || loadingOptions}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue
                                placeholder={
                                    loadingOptions ? t('loading') : t('selectMaterialType')
                                }
                            />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {materialTypes.map((materialType) => (
                                <SelectItem
                                    key={materialType.id}
                                    value={materialType.id.toString()}
                                >
                                    {materialType.name_th} - {materialType.name_en}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>


                <div>
                    <label className="text-sm font-medium text-gray-600">{t('sapSale')} ({t('optional')})</label>
                    <Select
                        value={form.sap_sale_id?.toString() || ''}
                        onValueChange={(value) => setForm({ ...form, sap_sale_id: value === "0" ? null : parseInt(value) || null })}
                        disabled={loading || loadingOptions}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={loadingOptions ? t('loading') : t('selectSapSale')} />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            <SelectItem value="0">{t('none')}</SelectItem>
                            {sapSales.map((sapSale) => (
                                <SelectItem key={sapSale.id} value={sapSale.id.toString()}>
                                    {sapSale.code} - {sapSale.description}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">{t('description')} *</label>
                    <Input
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        disabled={loading}
                        placeholder={t('descriptionPlaceholder')}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-600">{t('status')}</label>
                    <div className="flex items-center gap-2 mt-1">
                        <Switch
                            checked={form.status}
                            onCheckedChange={(checked) => setForm({ ...form, status: checked })}
                            disabled={loading}
                        />
                        <span className="text-sm">
                            {form.status ? t('active') : t('inactive')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose} disabled={loading}>
                    {t('cancel')}
                </Button>
                <Button variant="default" onClick={handleSubmit} disabled={loading || loadingOptions}>
                    {loading ? t('saving') : t('save')}
                </Button>
            </div>
        </div>
    );
}