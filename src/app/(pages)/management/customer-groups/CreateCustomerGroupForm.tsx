'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface CreateCustomerGroupFormProps {
    isVisible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function CreateCustomerGroupForm({ isVisible, onClose, onSuccess, onStart, onError }: CreateCustomerGroupFormProps) {
    const [formData, setFormData] = useState({
        name_th: '',
        name_en: '',
        level1: '',
        level2: '',
        description: '',
        status: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (onStart) onStart();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/customer-groups`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();

                let errorMessage = 'เกิดข้อผิดพลาดในการสร้างกลุ่มลูกค้า';

                if (res.status === 409 || res.status === 400) {
                    if (errorData.message && Array.isArray(errorData.message)) {
                        const translatedMessages = errorData.message.map((msg: string) => {
                            switch (msg) {
                                case 'Customer group already exists':
                                    return 'กลุ่มลูกค้านี้มีอยู่แล้ว';
                                default:
                                    return msg;
                            }
                        });
                        errorMessage = translatedMessages.join(', ');
                    } else {
                        errorMessage = errorData.message || 'เกิดข้อผิดพลาดในการสร้างกลุ่มลูกค้า';
                    }
                } else {
                    errorMessage = errorData.message || 'เกิดข้อผิดพลาดในการสร้างกลุ่มลูกค้า';
                }

                throw new Error(errorMessage);
            }

            setFormData({
                name_th: '',
                name_en: '',
                level1: '',
                level2: '',
                description: '',
                status: true
            });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการสร้างกลุ่มลูกค้า');
            if (onError) onError();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({
                name_th: '',
                name_en: '',
                level1: '',
                level2: '',
                description: '',
                status: true
            });
            setError(null);
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">เพิ่มกลุ่มลูกค้าใหม่</h2>
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
                            value={formData.name_th}
                            onChange={handleInputChange}
                            placeholder="ระบุชื่อกลุ่มลูกค้าภาษาไทย"
                            required
                            disabled={loading}
                            maxLength={100}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {formData.name_th.length}/100 ตัวอักษร
                        </div>
                    </div>

                    {/* name_en */}
                    <div className="space-y-2">
                        <Label htmlFor="name_en" className="text-sm text-gray-600">ชื่ออังกฤษ *</Label>
                        <Input
                            id="name_en"
                            name="name_en"
                            value={formData.name_en}
                            onChange={handleInputChange}
                            placeholder="ระบุชื่อกลุ่มลูกค้าภาษาอังกฤษ"
                            required
                            disabled={loading}
                            maxLength={100}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {formData.name_en.length}/100 ตัวอักษร
                        </div>
                    </div>

                    {/* level1 */}
                    <div className="space-y-2">
                        <Label htmlFor="level1" className="text-sm text-gray-600">ระดับ 1 *</Label>
                        <Input
                            id="level1"
                            name="level1"
                            value={formData.level1}
                            onChange={handleInputChange}
                            placeholder="ระบุระดับ 1"
                            required
                            disabled={loading}
                            maxLength={50}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {formData.level1.length}/50 ตัวอักษร
                        </div>
                    </div>

                    {/* level2 */}
                    <div className="space-y-2">
                        <Label htmlFor="level2" className="text-sm text-gray-600">ระดับ 2 *</Label>
                        <Input
                            id="level2"
                            name="level2"
                            value={formData.level2}
                            onChange={handleInputChange}
                            placeholder="ระบุระดับ 2"
                            required
                            disabled={loading}
                            maxLength={50}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {formData.level2.length}/50 ตัวอักษร
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description" className="text-sm text-gray-600">รายละเอียด</Label>
                        <Input
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="ระบุรายละเอียดกลุ่มลูกค้า"
                            maxLength={100}
                            className="w-full border rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-500">
                            {formData.description.length}/100 ตัวอักษร
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
                                กำลังสร้าง...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <IconDeviceFloppy className="w-4 h-4" />
                                สร้าง
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
