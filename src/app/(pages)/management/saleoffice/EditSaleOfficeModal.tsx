'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type SaleOffice = {
    id: number;
    site_code: string;
    site_office_name_th: string;
    site_office_name_en: string;
    status: boolean;
    create_at: string;
    update_at: string;
};

type EditModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedSaleOffice: SaleOffice | null;
    setSaleOffices: React.Dispatch<React.SetStateAction<SaleOffice[]>>;
    fetchSaleOffices: () => Promise<void>;
};

export default function EditSaleOfficeModal({
    open,
    setOpen,
    selectedSaleOffice,
    setSaleOffices,
    fetchSaleOffices,
}: EditModalProps) {
    const [editForm, setEditForm] = useState({
        site_office_name_th: "",
        site_office_name_en: "",
    });

    useEffect(() => {
        if (selectedSaleOffice) {
            setEditForm({
                site_office_name_th: selectedSaleOffice.site_office_name_th,
                site_office_name_en: selectedSaleOffice.site_office_name_en,
            });
        }
    }, [selectedSaleOffice]);

    const handleSubmitEdit = async () => {
        if (!selectedSaleOffice) return;

        try {
            const res = await fetch(`http://localhost:3000/sale-offices/${selectedSaleOffice.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });

            if (!res.ok) throw new Error("แก้ไขไม่สำเร็จ");

            setOpen(false);
            await fetchSaleOffices(); // ✅ ดึงข้อมูลใหม่แทนการ reload

        } catch (err) {
            alert("เกิดข้อผิดพลาดในการแก้ไข");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>แก้ไขข้อมูลสาขา</DialogTitle>
                    <DialogDescription>กรอกข้อมูลใหม่แล้วกดบันทึก</DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <div>
                        <label className="text-sm font-medium">ชื่อสาขา (TH)</label>
                        <input
                            className="w-full border px-2 py-1 rounded"
                            value={editForm.site_office_name_th}
                            onChange={(e) => setEditForm({ ...editForm, site_office_name_th: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">ชื่อสาขา (EN)</label>
                        <input
                            className="w-full border px-2 py-1 rounded"
                            value={editForm.site_office_name_en}
                            onChange={(e) => setEditForm({ ...editForm, site_office_name_en: e.target.value })}
                        />
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="secondary" onClick={() => setOpen(false)}>ยกเลิก</Button>
                    <Button onClick={handleSubmitEdit}>บันทึก</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
