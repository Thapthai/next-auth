'use client';

import { useEffect, useState } from "react";
import { SaleOffice } from "@/types/saleOffice";
import { Button } from "@/components/ui/button";

type Props = {
    saleOffice: SaleOffice | null;
    refresh: () => void; // เพื่อ reload ข้อมูลหลังจาก update
};

export default function SaleOfficeDetail({ saleOffice, refresh }: Props) {
    const [form, setForm] = useState({
        site_code: "",
        site_office_name_th: "",
        site_office_name_en: "",
        status: true,
    });

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

            if (!res.ok) throw new Error("ไม่สามารถบันทึกข้อมูลได้");

            alert("บันทึกสำเร็จ");
            refresh(); // โหลดใหม่
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    if (!saleOffice) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <h2 className="text-lg font-bold text-gray-800">แก้ไขสาขา</h2>

            <div className="space-y-2">
                <div>
                    <label className="text-sm text-gray-600">Site Code</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.site_code}
                        onChange={(e) => setForm({ ...form, site_code: e.target.value })}
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">ชื่อไทย</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.site_office_name_th}
                        onChange={(e) => setForm({ ...form, site_office_name_th: e.target.value })}
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">ชื่ออังกฤษ</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.site_office_name_en}
                        onChange={(e) => setForm({ ...form, site_office_name_en: e.target.value })}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">สถานะใช้งาน</label>
                    <input
                        type="checkbox"
                        checked={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.checked })}
                    />
                </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
                <Button variant="default" onClick={handleSubmit}>
                    💾 บันทึก
                </Button>
            </div>
        </div>
    );
}
