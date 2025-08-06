'use client';

import { useEffect, useState } from "react";
import { SaleOffice } from "@/types/saleOffice";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";

type Props = {
    saleOffice: SaleOffice | null;
    refresh: () => void; // เพื่อ reload ข้อมูลหลังจาก update
    onClose: () => void;
};

export default function SaleOfficeDetail({ saleOffice, refresh, onClose }: Props) {
    const t = useTranslations('saleOffice');
    const [form, setForm] = useState({
        site_code: "",
        site_office_name_th: "",
        site_office_name_en: "",
        status: true,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (saleOffice) {
            setForm({
                site_code: saleOffice.site_code || "",
                site_office_name_th: saleOffice.site_office_name_th || "",
                site_office_name_en: saleOffice.site_office_name_en || "",
                status: saleOffice.status ?? true,
            });
        }
    }, [saleOffice]);

    const handleSubmit = async () => {
        if (!saleOffice) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices/${saleOffice.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error(t('saveError'));

            alert(t('saveSuccess'));
            refresh(); // โหลดใหม่
        } catch (err) {
            alert(t('saveError'));
        }
    };
    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };
    

    if (!saleOffice) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{t('editTitle')}</h2>
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
                    <label className="text-sm text-gray-600">{t('siteCode')}</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.site_code}
                        onChange={(e) => setForm({ ...form, site_code: e.target.value })}
                        placeholder={t('siteCodePlaceholder')}
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">{t('nameThaiLabel')}</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.site_office_name_th}
                        onChange={(e) => setForm({ ...form, site_office_name_th: e.target.value })}
                        placeholder={t('nameThaiPlaceholder')}
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">{t('nameEnglishLabel')}</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.site_office_name_en}
                        onChange={(e) => setForm({ ...form, site_office_name_en: e.target.value })}
                        placeholder={t('nameEnglishPlaceholder')}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{t('status')}</span>
                    <Switch
                        checked={form.status}
                        onCheckedChange={(checked) => setForm({ ...form, status: checked })}
                    />
                    <span className="text-sm text-gray-600">
                        {form.status ? t('active') : t('inactive')}
                    </span>
                </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
                <Button variant="default" onClick={handleSubmit}>
                    <IconDeviceFloppy /> {t('save')}
                </Button>
            </div>
        </div >
    );
}
