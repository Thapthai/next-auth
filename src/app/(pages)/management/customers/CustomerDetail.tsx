'use client';

import { useEffect, useState } from "react";
import { Customer } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";


type Props = {
    customer: Customer | null;
    refresh: () => void;
    onClose: () => void;
};

export default function CustomerDetail({ customer, refresh, onClose }: Props) {
    const [form, setForm] = useState({
        customer_group_id: "",
        site_short_code: "",
        name_th: "",
        name_en: "",
        sale_office_id: "",
        department_id: "",
        payment_type_id: "",
        address: "",
        tel: "",
        tax_no: "",
        tax_id: "",
        tax_id_type: "",
        remark: "",
        email: "",
        status: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (customer) {
            setForm({
                customer_group_id: customer.customer_group_id?.toString() || "",
                site_short_code: customer.site_short_code || "",
                name_th: customer.name_th || "",
                name_en: customer.name_en || "",
                sale_office_id: customer.sale_office_id?.toString() || "",
                department_id: customer.department_id?.toString() || "",
                payment_type_id: customer.payment_type_id?.toString() || "",
                address: customer.address || "",
                tel: customer.tel || "",
                tax_no: customer.tax_no || "",
                tax_id: customer.tax_id || "",
                tax_id_type: customer.tax_id_type || "",
                remark: customer.remark || "",
                email: customer.email || "",
                status: customer.status ?? true,
            });
        }
    }, [customer]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customer) return;

        setLoading(true);
        setError(null);

        try {
            // Convert empty strings to undefined for optional fields
            const submitData = {
                ...form,
                customer_group_id: form.customer_group_id ? Number(form.customer_group_id) : undefined,
                sale_office_id: form.sale_office_id ? Number(form.sale_office_id) : undefined,
                department_id: form.department_id ? Number(form.department_id) : undefined,
                payment_type_id: form.payment_type_id ? Number(form.payment_type_id) : undefined,
                remark: form.remark || undefined,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/customers/${customer.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitData),
            });

            if (!res.ok) {
                const errorData = await res.json();

                let errorMessage = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';

                if (res.status === 409 || res.status === 400) {
                    if (errorData.message && Array.isArray(errorData.message)) {
                        const translatedMessages = errorData.message.map((msg: string) => {
                            switch (msg) {
                                case 'Email already exists':
                                    return 'อีเมลนี้มีอยู่ในระบบแล้ว';
                                case 'Site short code already exists':
                                    return 'รหัสไซต์นี้มีอยู่แล้ว';
                                case 'Site short code must not exceed 50 characters':
                                    return 'รหัสไซต์ต้องไม่เกิน 50 ตัวอักษร';
                                case 'Thai name must not exceed 100 characters':
                                    return 'ชื่อไทยต้องไม่เกิน 100 ตัวอักษร';
                                case 'English name must not exceed 100 characters':
                                    return 'ชื่ออังกฤษต้องไม่เกิน 100 ตัวอักษร';
                                default:
                                    return msg;
                            }
                        });
                        errorMessage = translatedMessages.join(', ');
                    } else {
                        errorMessage = errorData.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
                    }
                } else {
                    errorMessage = errorData.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
                }

                throw new Error(errorMessage);
            }

            refresh();
            onClose();
        } catch (err) {
            console.error('Update customer error:', err);
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    if (!customer) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">แก้ไขข้อมูลลูกค้า</h2>
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
                    
                    {/* site_short_code */}
                    <div className="space-y-2">
                        <Label htmlFor="site_short_code" className="text-sm text-gray-600">รหัสไซต์ *</Label>
                        <Input
                            id="site_short_code"
                            name="site_short_code"
                            value={form.site_short_code}
                            onChange={handleInputChange}
                            placeholder="ระบุรหัสไซต์"
                            required
                            disabled={loading}
                            maxLength={50}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.site_short_code.length}/50 ตัวอักษร
                        </div>
                    </div>

                    {/* name_th */}
                    <div className="space-y-2">
                        <Label htmlFor="name_th" className="text-sm text-gray-600">ชื่อไทย *</Label>
                        <Input
                            id="name_th"
                            name="name_th"
                            value={form.name_th}
                            onChange={handleInputChange}
                            placeholder="ระบุชื่อลูกค้าภาษาไทย"
                            required
                            disabled={loading}
                            maxLength={100}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.name_th.length}/100 ตัวอักษร
                        </div>
                    </div>

                    {/* name_en */}
                    <div className="space-y-2">
                        <Label htmlFor="name_en" className="text-sm text-gray-600">ชื่ออังกฤษ *</Label>
                        <Input
                            id="name_en"
                            name="name_en"
                            value={form.name_en}
                            onChange={handleInputChange}
                            placeholder="ระบุชื่อลูกค้าภาษาอังกฤษ"
                            required
                            disabled={loading}
                            maxLength={100}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.name_en.length}/100 ตัวอักษร
                        </div>
                    </div>

                    {/* email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm text-gray-600">อีเมล *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleInputChange}
                            placeholder="ระบุอีเมล"
                            required
                            disabled={loading}
                            className="w-full"
                        />
                    </div>

                    {/* tel */}
                    <div className="space-y-2">
                        <Label htmlFor="tel" className="text-sm text-gray-600">เบอร์โทร *</Label>
                        <Input
                            id="tel"
                            name="tel"
                            value={form.tel}
                            onChange={handleInputChange}
                            placeholder="ระบุเบอร์โทรศัพท์"
                            required
                            disabled={loading}
                            maxLength={20}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.tel.length}/20 ตัวอักษร
                        </div>
                    </div>

                    {/* tax_no */}
                    <div className="space-y-2">
                        <Label htmlFor="tax_no" className="text-sm text-gray-600">เลขประจำตัวผู้เสียภาษี *</Label>
                        <Input
                            id="tax_no"
                            name="tax_no"
                            value={form.tax_no}
                            onChange={handleInputChange}
                            placeholder="ระบุเลขประจำตัวผู้เสียภาษี"
                            required
                            disabled={loading}
                            maxLength={50}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.tax_no.length}/50 ตัวอักษร
                        </div>
                    </div>

                    {/* tax_id */}
                    <div className="space-y-2">
                        <Label htmlFor="tax_id" className="text-sm text-gray-600">เลขประจำตัว *</Label>
                        <Input
                            id="tax_id"
                            name="tax_id"
                            value={form.tax_id}
                            onChange={handleInputChange}
                            placeholder="ระบุเลขประจำตัว"
                            required
                            disabled={loading}
                            maxLength={50}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.tax_id.length}/50 ตัวอักษร
                        </div>
                    </div>

                    {/* tax_id_type */}
                    <div className="space-y-2">
                        <Label htmlFor="tax_id_type" className="text-sm text-gray-600">ประเภทเลขประจำตัว *</Label>
                        <Input
                            id="tax_id_type"
                            name="tax_id_type"
                            value={form.tax_id_type}
                            onChange={handleInputChange}
                            placeholder="ระบุประเภทเลขประจำตัว"
                            required
                            disabled={loading}
                            maxLength={20}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.tax_id_type.length}/20 ตัวอักษร
                        </div>
                    </div>

                    {/* customer_group_id */}
                    <div className="space-y-2">
                        <Label htmlFor="customer_group_id" className="text-sm text-gray-600">ID กลุ่มลูกค้า</Label>
                        <Input
                            id="customer_group_id"
                            name="customer_group_id"
                            type="number"
                            value={form.customer_group_id}
                            onChange={handleInputChange}
                            placeholder="ระบุ ID กลุ่มลูกค้า (ถ้ามี)"
                            disabled={loading}
                            className="w-full"
                        />
                    </div>

                    {/* sale_office_id */}
                    <div className="space-y-2">
                        <Label htmlFor="sale_office_id" className="text-sm text-gray-600">ID สำนักงานขาย</Label>
                        <Input
                            id="sale_office_id"
                            name="sale_office_id"
                            type="number"
                            value={form.sale_office_id}
                            onChange={handleInputChange}
                            placeholder="ระบุ ID สำนักงานขาย (ถ้ามี)"
                            disabled={loading}
                            className="w-full"
                        />
                    </div>

                    {/* department_id */}
                    <div className="space-y-2">
                        <Label htmlFor="department_id" className="text-sm text-gray-600">ID แผนก</Label>
                        <Input
                            id="department_id"
                            name="department_id"
                            type="number"
                            value={form.department_id}
                            onChange={handleInputChange}
                            placeholder="ระบุ ID แผนก (ถ้ามี)"
                            disabled={loading}
                            className="w-full"
                        />
                    </div>

                    {/* payment_type_id */}
                    <div className="space-y-2">
                        <Label htmlFor="payment_type_id" className="text-sm text-gray-600">ID ประเภทการชำระเงิน</Label>
                        <Input
                            id="payment_type_id"
                            name="payment_type_id"
                            type="number"
                            value={form.payment_type_id}
                            onChange={handleInputChange}
                            placeholder="ระบุ ID ประเภทการชำระเงิน (ถ้ามี)"
                            disabled={loading}
                            className="w-full"
                        />
                    </div>

                    {/* address */}
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address" className="text-sm text-gray-600">ที่อยู่ *</Label>
                        <textarea
                            id="address"
                            name="address"
                            value={form.address}
                            onChange={handleInputChange}
                            placeholder="ระบุที่อยู่"
                            required
                            disabled={loading}
                            maxLength={300}
                            rows={3}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {form.address.length}/300 ตัวอักษร
                        </div>
                    </div>

                    {/* remark */}
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="remark" className="text-sm text-gray-600">หมายเหตุ</Label>
                        <textarea
                            id="remark"
                            name="remark"
                            value={form.remark}
                            onChange={handleInputChange}
                            placeholder="ระบุหมายเหตุ (ถ้ามี)"
                            disabled={loading}
                            maxLength={200}
                            rows={2}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {form.remark.length}/200 ตัวอักษร
                        </div>
                    </div>

                    {/* status */}
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="status" className="text-sm text-gray-600">สถานะ</Label>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="status"
                                name="status"
                                onCheckedChange={(checked) => setForm({ ...form, status: checked })}
                                disabled={loading}
                                checked={form.status}
                            />
                            <span className="text-sm text-gray-600">
                                {form.status ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                กำลังบันทึก...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <IconDeviceFloppy className="w-4 h-4" />
                                บันทึก
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
