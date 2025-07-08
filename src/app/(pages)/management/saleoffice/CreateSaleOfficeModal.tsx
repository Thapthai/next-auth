'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";

interface CreateSaleOfficeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateSaleOfficeModal({ isOpen, onClose, onSuccess }: CreateSaleOfficeModalProps) {
    const [formData, setFormData] = useState({
        site_code: '',
        site_office_name_th: '',
        site_office_name_en: '',
        address: '',
        phone: '',
        email: ''
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

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'เกิดข้อผิดพลาดในการสร้างสาขา');
            }

            // สร้างสำเร็จ
            setFormData({
                site_code: '',
                site_office_name_th: '',
                site_office_name_en: '',
                address: '',
                phone: '',
                email: ''
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Create sale office error:', err);
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการสร้างสาขา');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({
                site_code: '',
                site_office_name_th: '',
                site_office_name_en: '',
                address: '',
                phone: '',
                email: ''
            });
            setError(null);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>สร้างสาขาใหม่</DialogTitle>
                </DialogHeader>
                
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="site_code">Site Code *</Label>
                            <Input
                                id="site_code"
                                name="site_code"
                                value={formData.site_code}
                                onChange={handleInputChange}
                                placeholder="เช่น: BKK001"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="เช่น: 02-123-4567"
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="site_office_name_th">ชื่อสาขา (ภาษาไทย) *</Label>
                            <Input
                                id="site_office_name_th"
                                name="site_office_name_th"
                                value={formData.site_office_name_th}
                                onChange={handleInputChange}
                                placeholder="เช่น: สาขาสีลม"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="site_office_name_en">ชื่อสาขา (ภาษาอังกฤษ) *</Label>
                            <Input
                                id="site_office_name_en"
                                name="site_office_name_en"
                                value={formData.site_office_name_en}
                                onChange={handleInputChange}
                                placeholder="เช่น: Silom Branch"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="email">อีเมล</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="เช่น: silom@company.com"
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">ที่อยู่</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="ที่อยู่ของสาขา"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t">
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
                                    สร้างสาขา
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 