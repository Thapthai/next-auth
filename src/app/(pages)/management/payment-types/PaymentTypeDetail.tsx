'use client';

import { useEffect, useState } from "react";
import { PaymentType } from "@/types/paymentType";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";

type Props = {
    paymentType: PaymentType | null;
    refresh: () => void;
    onClose: () => void;
};

export default function PaymentTypeDetail({ paymentType, refresh, onClose }: Props) {
    const [form, setForm] = useState({
        name_th: "",
        name_en: "",
        description: "",
        status: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (paymentType) {
            setForm({
                name_th: paymentType.name_th || "",
                name_en: paymentType.name_en || "",
                description: paymentType.description || "",
                status: paymentType.status ?? true,
            });
        }
    }, [paymentType]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentType) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payment-types/${paymentType.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const errorData = await res.json();

                let errorMessage = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';

                if (res.status === 409 || res.status === 400) {
                    if (errorData.message && Array.isArray(errorData.message)) {
                        const translatedMessages = errorData.message.map((msg: string) => {
                            switch (msg) {
                                case 'Payment type already exists':
                                    return 'ประเภทการชำระเงินนี้มีอยู่แล้ว';
                                case 'name_th should not be empty':
                                    return 'ชื่อไทยห้ามเป็นค่าว่าง';
                                case 'name_en should not be empty':
                                    return 'ชื่ออังกฤษห้ามเป็นค่าว่าง';
                                case 'name_th must not exceed 100 characters':
                                    return 'ชื่อไทยต้องไม่เกิน 100 ตัวอักษร';
                                case 'name_en must not exceed 100 characters':
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
            console.error('Update payment type error:', err);
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

    if (!paymentType) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">แก้ไขประเภทการชำระเงิน</h2>
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
                    {/* name_th */}
                    <div className="space-y-2">
                        <Label htmlFor="name_th" className="text-sm text-gray-600">ชื่อไทย *</Label>
                        <Input
                            id="name_th"
                            name="name_th"
                            value={form.name_th}
                            onChange={handleInputChange}
                            placeholder="ระบุชื่อประเภทการชำระเงินภาษาไทย"
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
                            placeholder="ระบุชื่อประเภทการชำระเงินภาษาอังกฤษ"
                            required
                            disabled={loading}
                            maxLength={100}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.name_en.length}/100 ตัวอักษร
                        </div>
                    </div>

                    {/* description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm text-gray-600">คำอธิบาย</Label>
                        <Input
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleInputChange}
                            placeholder="ระบุคำอธิบายประเภดารชำระเงิน"
                            disabled={loading}
                            maxLength={100}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            {form.description.length}/100 ตัวอักษร
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
