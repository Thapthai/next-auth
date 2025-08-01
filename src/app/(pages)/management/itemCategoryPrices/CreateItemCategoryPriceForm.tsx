'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface CreateItemCategoryPriceFormProps {
    isVisible: boolean;
    itemCategoryData: any[];
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function CreateItemCategoryPriceForm({
    isVisible,
    itemCategoryData,
    onClose,
    onSuccess,
    onStart,
    onError
}: CreateItemCategoryPriceFormProps) {
    const t = useTranslations('ItemCategoryPrices');
    const [form, setForm] = useState({
        item_category_id: 0,
        price: 0,
        description: '',
        status: true
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        if (onStart) onStart();

        console.log(form);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/item-category-prices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error('Failed to create item category price');
            }

            // สร้างสำเร็จ - รีเซ็ตฟอร์ม
            setForm({
                item_category_id: 0,
                price: 0,
                description: '',
                status: true
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Create item category price error:', err);
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setForm({
                item_category_id: 0,
                price: 0,
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
                <h2 className="text-lg font-bold text-gray-800">{t('createNewItemCategoryPrice')}</h2>
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
                    <label className="text-sm text-gray-600">{t('itemCategory')}</label>
                    <Select
                        value={form.item_category_id.toString()}
                        onValueChange={(value) => setForm({ ...form, item_category_id: parseInt(value) || 0 })}
                        disabled={loading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('selectItemCategory')} />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {itemCategoryData.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name_th} - {category.name_en}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('price')}</label>
                    <Input
                        type="number"
                        step="0.01"
                        value={form.price.toString()}
                        onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                        disabled={loading}
                        placeholder={t('pricePlaceholder')}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-sm text-gray-600">{t('description')}</label>
                    <Input
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        disabled={loading}
                        placeholder={t('descriptionPlaceholder')}
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