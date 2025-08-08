'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Material } from "@/types/material";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface CreateStockLocationFormProps {
    isVisible: boolean;
    saleOfficeData: any[];
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function CreateStockLocationForm({
    isVisible,
    saleOfficeData,
    onClose,
    onSuccess,
    onStart,
    onError
}: CreateStockLocationFormProps) {
    const t = useTranslations('StockLocations');
    const [form, setForm] = useState({
        sale_office_id: 0,
        department_id: 0,
        site_short_code: '',
        description: '',
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
            sale_office_id: saleOfficeId,
            department_id: 0 // Reset department when office changes
        });
        fetchDepartmentsBySaleOffice(saleOfficeId);
    };

    // Initialize filtered departments on component mount
    useEffect(() => {
        if (form.sale_office_id > 0) {
            fetchDepartmentsBySaleOffice(form.sale_office_id);
        } else {
            setFilteredDepartments([]);
        }
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        if (onStart) onStart();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stock-locations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error('Failed to create stock location');
            }

            // สร้างสำเร็จ - รีเซ็ตฟอร์ม
            setForm({
                sale_office_id: 0,
                department_id: 0,
                site_short_code: '',
                description: '',
                status: true
            });
            setFilteredDepartments([]);
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Create stock location error:', err);
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setForm({
                sale_office_id: 0,
                department_id: 0,
                site_short_code: '',
                description: '',
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
                <h2 className="text-lg font-bold text-gray-800">{t('createNewStockLocation')}</h2>
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

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm text-gray-600">{t('site_short_code')}</label>
                    <Input
                        value={form.site_short_code}
                        onChange={(e) => setForm({ ...form, site_short_code: e.target.value })}
                        disabled={loading}
                        placeholder={t('site_short_code')}
                        required
                        maxLength={50}
                    />
                    <div className="text-xs text-gray-500">
                        {form.site_short_code.length}/50 ตัวอักษร
                    </div>
                </div>



                <div className="space-y-2">
                    <label className="text-sm text-gray-600">{t('saleOffice')}</label>
                    <Select
                        value={form.sale_office_id.toString()}
                        onValueChange={handleSaleOfficeChange}
                        disabled={loading}
                        required
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('selectSaleOffice')} />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {saleOfficeData.map((office) => (
                                <SelectItem key={office.id} value={office.id.toString()}>
                                    {office.name_th} - {office.name_en}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
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

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm text-gray-600">{t('description')}</label>
                    <Input
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        disabled={loading}
                        placeholder={t('description')}
                        required
                        maxLength={100}
                    />
                    <div className="text-xs text-gray-500">
                        {form.description.length}/100 ตัวอักษร
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