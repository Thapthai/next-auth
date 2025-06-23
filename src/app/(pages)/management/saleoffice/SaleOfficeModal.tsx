'use client';

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SaleOffice } from "@/types/saleOffice";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    saleOffice: SaleOffice | null;
    refresh: () => void;
};

export default function SaleOfficeModal({ open, setOpen, saleOffice, refresh }: Props) {
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
        } else {
            setForm({
                site_code: "",
                site_office_name_th: "",
                site_office_name_en: "",
                status: true,
            });
        }
    }, [saleOffice]);

    const handleSubmit = async () => {
        const url = saleOffice
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices/${saleOffice.id}`
            : `${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices`;

        const method = saleOffice ? "PATCH" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("ไม่สามารถบันทึกข้อมูลได้");

            setOpen(false);
            refresh();
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{saleOffice ? "แก้ไขสาขา" : "เพิ่มสาขาใหม่"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                    <input
                        className="w-full border rounded px-2 py-1"
                        placeholder="Site Code"
                        value={form.site_code}
                        onChange={(e) => setForm({ ...form, site_code: e.target.value })}
                    />
                    <input
                        className="w-full border rounded px-2 py-1"
                        placeholder="ชื่อไทย"
                        value={form.site_office_name_th}
                        onChange={(e) => setForm({ ...form, site_office_name_th: e.target.value })}
                    />
                    <input
                        className="w-full border rounded px-2 py-1"
                        placeholder="ชื่ออังกฤษ"
                        value={form.site_office_name_en}
                        onChange={(e) => setForm({ ...form, site_office_name_en: e.target.value })}
                    />
                    <div className="flex items-center space-x-2">
                        <label className="text-sm">สถานะใช้งาน</label>
                        <input
                            type="checkbox"
                            checked={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.checked })}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        ยกเลิก
                    </Button>
                    <Button onClick={handleSubmit}>บันทึก</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
