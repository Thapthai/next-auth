'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { ItemCategory } from "@/types/itemCategory";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface ItemCategoryDetailProps {
    itemCategory: ItemCategory;
    isVisible: boolean;
    saleOfficeData: any[];
    departmentData: any[];
    materialData: any[];
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function ItemCategoryDetail({
    itemCategory,
    isVisible,
    saleOfficeData,
    departmentData,
    materialData,
    onClose,
    onSuccess,
    onStart,
    onError
}: ItemCategoryDetailProps) {
    const t = useTranslations('ItemCategories');
    const [form, setForm] = useState({
        name_th: '',
        name_en: '',
        material_id: 0,
        sale_office_id: 0,
        department_id: 0,
        stock_location_id: 0,
        description: '',
        status: true
    });
    const [loading, setLoading] = useState(false);
    const [filteredDepartments, setFilteredDepartments] = useState<any[]>([]);
    const [loadingDepartments, setLoadingDepartments] = useState(false);

    useEffect(() => {
        if (itemCategory) {
            setForm({
                name_th: itemCategory.name_th || '',
                name_en: itemCategory.name_en || '',
                material_id: itemCategory.material_id || 0,
                sale_office_id: itemCategory.sale_office_id || 0,
                department_id: itemCategory.department_id || 0,
                stock_location_id: itemCategory.stock_location_id || 0,
                description: itemCategory.description || '',
                status: itemCategory.status ?? true
            });
        }
    }, [itemCategory]);

    // Fetch departments by sale office
    const fetchDepartmentsBySaleOffice = async (saleOfficeId: number) => {
        if (saleOfficeId === 0) {
            setFilteredDepartments([]);
            return;
        }

        setLoadingDepartments(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/departments/sale-offices?saleOfficeId=${saleOfficeId}`);
            if (res.ok) {
                const data = await res.json();
                setFilteredDepartments(data.items || data || []);
            } else {
                setFilteredDepartments([]);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
            setFilteredDepartments([]);
        } finally {
            setLoadingDepartments(false);
        }
    };

    // Handle sale office change
    const handleSaleOfficeChange = (value: string) => {
        const saleOfficeId = parseInt(value) || 0;
        setForm({ 
            ...form, 
            sale_office_id: saleOfficeId,
            department_id: 0 // Reset department when office changes
        });
        fetchDepartmentsBySaleOffice(saleOfficeId);
    };

    // Load departments when item category changes or office changes
    useEffect(() => {
        if (form.sale_office_id > 0) {
            fetchDepartmentsBySaleOffice(form.sale_office_id);
        } else {
            setFilteredDepartments([]);
        }
    }, [form.sale_office_id]);

    const handleSubmit = async () => {
        setLoading(true);
        if (onStart) onStart();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/item-categories/${itemCategory.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error('Failed to update item category');
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Update item category error:', err);
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
                <h2 className="text-lg font-bold text-gray-800">{t('editItemCategory')}</h2>
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
                    <label className="text-sm text-gray-600">{t('nameThai')}</label>
                    <Input
                        type="text"
                        value={form.name_th}
                        onChange={(e) => setForm({ ...form, name_th: e.target.value })}
                        placeholder={t('nameThaiPlaceholder')}
                        disabled={loading}
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('nameEnglish')}</label>
                    <Input
                        type="text"
                        value={form.name_en}
                        onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                        placeholder={t('nameEnglishPlaceholder')}
                        disabled={loading}
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('material')}</label>
                    <Select
                        value={form.material_id.toString()}
                        onValueChange={(value) => setForm({ ...form, material_id: parseInt(value) || 0 })}
                        disabled={loading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('selectMaterial')} />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {materialData.map((material) => (
                                <SelectItem key={material.id} value={material.id.toString()}>
                                    {material.material_code} - {material.name_th} ({material.name_en})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('saleOffice')}</label>
                    <Select
                        value={form.sale_office_id.toString()}
                        onValueChange={handleSaleOfficeChange}
                        disabled={loading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('selectSaleOffice')} />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {saleOfficeData.map((office) => (
                                <SelectItem key={office.id} value={office.id.toString()}>
                                    {office.site_code} - {office.site_office_name_th}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('department')}</label>
                    <Select
                        value={form.department_id.toString()}
                        onValueChange={(value) => setForm({ ...form, department_id: parseInt(value) || 0 })}
                        disabled={loading || loadingDepartments || form.sale_office_id === 0}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={
                                form.sale_office_id === 0 
                                    ? t('selectSaleOfficeFirst') 
                                    : loadingDepartments 
                                        ? t('loading') 
                                        : t('selectDepartment')
                            } />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {filteredDepartments.length > 0 ? (
                                filteredDepartments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                        {dept.department_code} - {dept.name_th}
                                    </SelectItem>
                                ))
                            ) : (
                                form.sale_office_id > 0 && !loadingDepartments && (
                                    <SelectItem value="0" disabled>
                                        {t('noDepartmentsFound')}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('stockLocation')}</label>
                    <Input
                        type="number"
                        value={form.stock_location_id.toString()}
                        onChange={(e) => setForm({ ...form, stock_location_id: parseInt(e.target.value) || 0 })}
                        disabled={loading}
                        placeholder={t('stockLocation')}
                    />
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