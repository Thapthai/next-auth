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
import { Permission } from "@/types/permission";

type EditModalProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedPermission: Permission | null;
    setPermissions: React.Dispatch<React.SetStateAction<Permission[]>>;
    fetchPermissions: () => Promise<void>; // ✅ เพิ่มฟังก์ชันโหลดใหม่
};

export default function EditModal({
    open,
    setOpen,
    selectedPermission,
    fetchPermissions,
}: EditModalProps) {
    const [editForm, setEditForm] = useState({
        name_th: "",
        name_en: "",
        description: "",
    });

    useEffect(() => {
        if (selectedPermission) {
            setEditForm({
                name_th: selectedPermission.name_th,
                name_en: selectedPermission.name_en,
                description: selectedPermission.description || "",
            });
        }
    }, [selectedPermission]);

    const handleSubmitEdit = async () => {
        if (!selectedPermission) return;

        try {
            const res = await fetch(`http://localhost:3000/permission/${selectedPermission.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });

            if (!res.ok) throw new Error("แก้ไขไม่สำเร็จ");

            setOpen(false);

            // ✅ เรียกเฉพาะ fetchPermissions ไม่รีโหลดทั้งหน้า
            fetchPermissions();

        } catch (err) {
            alert("เกิดข้อผิดพลาดในการแก้ไข");
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>แก้ไขสิทธิ์</DialogTitle>
                    <DialogDescription>กรอกข้อมูลใหม่แล้วกดบันทึก</DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <div>
                        <label className="text-sm font-medium">ชื่อ (TH)</label>
                        <input
                            className="w-full border px-2 py-1 rounded"
                            value={editForm.name_th}
                            onChange={(e) => setEditForm({ ...editForm, name_th: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">ชื่อ (EN)</label>
                        <input
                            className="w-full border px-2 py-1 rounded"
                            value={editForm.name_en}
                            onChange={(e) => setEditForm({ ...editForm, name_en: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">คำอธิบาย</label>
                        <textarea
                            className="w-full border px-2 py-1 rounded"
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
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
