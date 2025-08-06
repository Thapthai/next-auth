'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { SaleOfficeGroup } from "@/types/saleOfficeGroup";

interface SaleOfficeGroupDetailProps {
    saleOfficeGroup: SaleOfficeGroup;
    isVisible: boolean;
    saleOfficeData: any[];
    saleOfficeGroupTypeData: any[];
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function SaleOfficeGroupDetail({
    saleOfficeGroup,
    isVisible,
    saleOfficeData,
    saleOfficeGroupTypeData,
    onClose,
    onSuccess,
    onStart,
    onError
}: SaleOfficeGroupDetailProps) {
    const t = useTranslations('SaleOfficeGroups');
    const [form, setForm] = useState({
        name_th: '',
        name_en: '',
        description: '',
        code: '',
        sale_office_id: 0,
        sale_office_group_type_id: 0,
        status: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (saleOfficeGroup) {
            setForm({
                name_th: saleOfficeGroup.name_th || '',
                name_en: saleOfficeGroup.name_en || '',
                description: saleOfficeGroup.description || '',
                code: saleOfficeGroup.code || '',
                sale_office_id: saleOfficeGroup.sale_office_id || 0,
                sale_office_group_type_id: saleOfficeGroup.sale_office_group_type_id || 0,
                status: saleOfficeGroup.status ?? true
            });
        }
    }, [saleOfficeGroup]);

    const handleSubmit = async () => {
        setLoading(true);
        if (onStart) onStart();

        try {
            const submitData = {
                ...form,
                description: form.description || '',
                code: form.code || '',
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-office-groups/${saleOfficeGroup.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            if (!res.ok) {
                throw new Error('Failed to update sale office group');
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Update sale office group error:', err);
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
                <h2 className="text-lg font-bold text-gray-800">{t('editSaleOfficeGroup')}</h2>
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
                    <label className="text-sm text-gray-600">{t('nameTh')}</label>
                    <Input
                        value={form.name_th}
                        onChange={(e) => setForm({ ...form, name_th: e.target.value })}
                        disabled={loading}
                        placeholder={t('nameTh')}
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('nameEn')}</label>
                    <Input
                        value={form.name_en}
                        onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                        disabled={loading}
                        placeholder={t('nameEn')}
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('code')}</label>
                    <Input
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                        disabled={loading}
                        placeholder={t('code')}
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('saleOffice')}</label>
                    <Select
                        value={form.sale_office_id.toString()}
                        onValueChange={(value) => setForm({ ...form, sale_office_id: parseInt(value) || 0 })}
                        disabled={loading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('selectSaleOffice')} />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {saleOfficeData.map((office) => (
                                <SelectItem key={office.id} value={office.id.toString()}>
                                    {office.site_office_name_th} - {office.site_office_name_en}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('saleOfficeGroupType')}</label>
                    <Select
                        value={form.sale_office_group_type_id.toString()}
                        onValueChange={(value) => setForm({ ...form, sale_office_group_type_id: parseInt(value) || 0 })}
                        disabled={loading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('selectSaleOfficeGroupType')} />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {saleOfficeGroupTypeData.map((type) => (
                                <SelectItem key={type.id} value={type.id.toString()}>
                                    {type.level} - {type.group} - {type.type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="md:col-span-2">
                    <label className="text-sm text-gray-600">{t('description')}</label>
                    <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={form.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })}
                        disabled={loading}
                        placeholder={t('description')}
                        rows={3}
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
                        <span className="text-sm text-gray-600">
                            {form.status ? t('active') : t('inactive')}
                        </span>
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