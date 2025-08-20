'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Material } from "@/types/material";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface CreateLogisticsFormProps {
    isVisible: boolean;
    materialData: Material[];
    saleOfficeData: any[];
    departmentData: any[];
    itemCategoryData: any[];
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function CreateLogisticsForm({
    isVisible,
    materialData,
    saleOfficeData,
    departmentData,
    itemCategoryData,
    onClose,
    onSuccess,
    onStart,
    onError
}: CreateLogisticsFormProps) {
    const t = useTranslations('Logistics');
    const [form, setForm] = useState({
        material_id: null as number | null,
        saleoffice_id: 0,
        department_id: 0,
        item_category_id: null as number | null,
        stock_location_id: 0,
        rfid_number: null as string | null,
        name_th: '',
        name_en: '',
        status: true
    });
    const [loading, setLoading] = useState(false);
    const [filteredDepartments, setFilteredDepartments] = useState<any[]>([]);
    const [loadingDepartments, setLoadingDepartments] = useState(false);

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
            saleoffice_id: saleOfficeId,
            department_id: 0 // Reset department when office changes
        });
        fetchDepartmentsBySaleOffice(saleOfficeId);
    };

    // Initialize filtered departments on component mount
    useEffect(() => {
        if (form.saleoffice_id > 0) {
            fetchDepartmentsBySaleOffice(form.saleoffice_id);
        } else {
            setFilteredDepartments([]);
        }
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        if (onStart) onStart();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error('Failed to create item');
            }

            // สร้างสำเร็จ - รีเซ็ตฟอร์ม
            setForm({
                material_id: null,
                saleoffice_id: 0,
                department_id: 0,
                item_category_id: null,
                stock_location_id: 0,
                rfid_number: null,
                name_th: '',
                name_en: '',
                status: true
            });
            setFilteredDepartments([]);
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Create item error:', err);
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setForm({
                material_id: null,
                saleoffice_id: 0,
                department_id: 0,
                item_category_id: null,
                stock_location_id: 0,
                rfid_number: null,
                name_th: '',
                name_en: '',
                status: true
            });
            setFilteredDepartments([]);
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
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
                    <label className="text-sm text-gray-600">{t('nameThai')}</label>
                    <Input
                        value={form.name_th}
                        onChange={(e) => setForm({ ...form, name_th: e.target.value })}
                        disabled={loading}
                        placeholder={t('nameThai')}
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('nameEnglish')}</label>
                    <Input
                        value={form.name_en}
                        onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                        disabled={loading}
                        placeholder={t('nameEnglish')}
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">{t('material')}</label>
                    <Select
                        value={form.material_id?.toString() || ''}
                        onValueChange={(value) => setForm({ ...form, material_id: value === "0" ? null : parseInt(value) || null })}
                        disabled={loading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('selectMaterial')} />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            <SelectItem value="0">{t('none')}</SelectItem>
                            {materialData.map((material) => (
                                <SelectItem key={material.id} value={material.id.toString()}>
                                    {material.material_code} - {material.material_name_en} ({material.material_name_en})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('saleOffice')}</label>
                    <Select
                        value={form.saleoffice_id.toString()}
                        onValueChange={handleSaleOfficeChange}
                        disabled={loading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('selectSaleOffice')} />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {saleOfficeData.map((office) => (
                                <SelectItem key={office.id} value={office.id.toString()}>
                                    {office.site_office_name_th} - {office.site_office_name_th}
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
                        disabled={loading || loadingDepartments || form.saleoffice_id === 0}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={
                                form.saleoffice_id === 0
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
                                form.saleoffice_id > 0 && !loadingDepartments && (
                                    <SelectItem value="0" disabled>
                                        {t('noDepartmentsFound')}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-sm text-gray-600">{t('itemCategory')}</label>
                    <Select
                        value={form.item_category_id?.toString() || ''}
                        onValueChange={(value) => setForm({ ...form, item_category_id: value === "0" ? null : parseInt(value) || null })}
                        disabled={loading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('selectItemCategory')} />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            <SelectItem value="0">{t('none')}</SelectItem>
                            {itemCategoryData.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name_th} - {category.name_en}
                                </SelectItem>
                            ))}
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

                <div>
                    <label className="text-sm text-gray-600">{t('rfidNumber')}</label>
                    <Input
                        value={form.rfid_number || ''}
                        onChange={(e) => setForm({ ...form, rfid_number: e.target.value })}
                        disabled={loading}
                        placeholder={t('rfidNumber')}
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