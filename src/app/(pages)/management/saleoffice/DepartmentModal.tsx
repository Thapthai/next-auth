'use client';

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Department } from "@/types/department";



type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    saleOfficeId: number | null;
    department: Department | null;
    refresh: () => void;
};

export default function DepartmentModal({ open, setOpen, saleOfficeId, department, refresh }: Props) {
    const [form, setForm] = useState({
        department_code: "",
        name_th: "",
        name_en: "",
        description: "",
        group_code: "",
        ship_id: "0",
        is_default: false,
        status: true,
    });

    useEffect(() => {
        if (department) {
            setForm({
                department_code: department.department_code,
                name_th: department.name_th,
                name_en: department.name_en,
                description: department.description,
                group_code: department.group_code,
                ship_id: department.ship_id.toString(),
                is_default: department.is_default,
                status: department.status,
            });
        } else {
            setForm({
                department_code: "",
                name_th: "",
                name_en: "",
                description: "",
                group_code: "",
                ship_id: "0",
                is_default: false,
                status: true,
            });
        }
    }, [department]);

    const handleSubmit = async () => {
        if (!saleOfficeId) return;

        const payload = {
            department_code: form.department_code,
            sale_office_id: saleOfficeId,
            description: form.description,
            group_code: form.group_code,
            ship_id: Number(form.ship_id),
            is_default: form.is_default,
            name_th: form.name_th,
            name_en: form.name_en,
            status: form.status,
        };

        try {
            const res = await fetch("http://localhost:3000/departments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("เพิ่มแผนกไม่สำเร็จ");

            setOpen(false);
            refresh(); // ดึงข้อมูลใหม่
        } catch (err) {
            alert("เกิดข้อผิดพลาดขณะเพิ่มแผนก");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{department ? "แก้ไขแผนก" : "เพิ่มแผนกใหม่"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                    <input
                        className="w-full border rounded px-2 py-1"
                        placeholder="รหัสแผนก"
                        value={form.department_code}
                        onChange={(e) => setForm({ ...form, department_code: e.target.value })}
                    />
                    <input
                        className="w-full border rounded px-2 py-1"
                        placeholder="ชื่อไทย"
                        value={form.name_th}
                        onChange={(e) => setForm({ ...form, name_th: e.target.value })}
                    />
                    <input
                        className="w-full border rounded px-2 py-1"
                        placeholder="ชื่ออังกฤษ"
                        value={form.name_en}
                        onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                    />
                    <textarea
                        className="w-full border rounded px-2 py-1"
                        placeholder="คำอธิบาย"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    <input
                        className="w-full border rounded px-2 py-1"
                        placeholder="Group Code"
                        value={form.group_code}
                        onChange={(e) => setForm({ ...form, group_code: e.target.value })}
                    />
                    <input
                        className="w-full border rounded px-2 py-1"
                        type="number"
                        placeholder="Ship ID"
                        value={form.ship_id}
                        onChange={(e) => setForm({ ...form, ship_id: e.target.value })}
                    />
                    <div className="flex items-center space-x-2">
                        <label className="text-sm">Default:</label>
                        <input
                            type="checkbox"
                            checked={form.is_default}
                            onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <label className="text-sm">สถานะใช้งาน:</label>
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
                    <Button onClick={handleSubmit}>
                        บันทึก
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
