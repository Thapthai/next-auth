'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";

interface CreateItemFormProps {
    isVisible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onStart?: () => void;
    onError?: () => void;
}

export default function CreateItemForm({ isVisible, onClose, onSuccess, onStart, onError }: CreateItemFormProps) {
    const [form, setForm] = useState({
        name_th: '',
        name_en: '',
        status: true
    });
    const [loading, setLoading] = useState(false);

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
                name_th: '',
                name_en: '',
                status: true
            });
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
                name_th: '',
                name_en: '',
                status: true
            });
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">สร้าง Item ใหม่</h2>
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

            <div className="space-y-2">
                <div>
                    <label className="text-sm text-gray-600">ชื่อไทย</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.name_th}
                        onChange={(e) => setForm({ ...form, name_th: e.target.value })}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">ชื่ออังกฤษ</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.name_en}
                        onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                        disabled={loading}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">สถานะ</label>
                    <input
                        type="checkbox"
                        checked={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.checked })}
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose} disabled={loading}>
                    ยกเลิก
                </Button>
                <Button variant="default" onClick={handleSubmit} disabled={loading}>
                    {loading ? '💾 กำลังบันทึก...' : '💾 บันทึก'}
                </Button>
            </div>
        </div>
    );
}