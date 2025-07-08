'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface CreateSaleOfficeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateSaleOfficeModal({ isOpen, onClose, onSuccess }: CreateSaleOfficeModalProps) {
    const t = useTranslations('saleOffice');
    
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
                throw new Error(errorData.message || t('createError'));
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
            setError(err instanceof Error ? err.message : t('createError'));
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
                    <DialogTitle>{t('createTitle')}</DialogTitle>
                </DialogHeader>
                
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="site_code">{t('siteCode')} *</Label>
                            <Input
                                id="site_code"
                                name="site_code"
                                value={formData.site_code}
                                onChange={handleInputChange}
                                placeholder={t('siteCodePlaceholder')}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">{t('phone')}</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder={t('phonePlaceholder')}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="site_office_name_th">{t('nameThaiLabel')} *</Label>
                            <Input
                                id="site_office_name_th"
                                name="site_office_name_th"
                                value={formData.site_office_name_th}
                                onChange={handleInputChange}
                                placeholder={t('nameThaiPlaceholder')}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="site_office_name_en">{t('nameEnglishLabel')} *</Label>
                            <Input
                                id="site_office_name_en"
                                name="site_office_name_en"
                                value={formData.site_office_name_en}
                                onChange={handleInputChange}
                                placeholder={t('nameEnglishPlaceholder')}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder={t('emailPlaceholder')}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">{t('address')}</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder={t('addressPlaceholder')}
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
                            {t('cancel')}
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {t('creating')}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <IconDeviceFloppy className="w-4 h-4" />
                                    {t('createButton')}
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 