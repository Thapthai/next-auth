'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Department } from "@/types/department";

interface Props {
    department: Department | null;
    refresh: () => void;
}

export default function DepartmentDetailForm({ department, refresh }: Props) {
    const [form, setForm] = useState({
        department_code: "",
        name_th: "",
        name_en: "",
        description: "",
    });

    useEffect(() => {
        if (department) {
            setForm({
                department_code: department.department_code || "",
                name_th: department.name_th || "",
                name_en: department.name_en || "",
                description: department.description || "",
            });
        }
    }, [department]);

    const handleSubmit = async () => {
        if (!department) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/departments/${department.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("ไม่สามารถบันทึกข้อมูลได้");

            alert("บันทึกสำเร็จ");
            refresh();
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    if (!department) return null;

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white space-y-3">
            <h2 className="text-lg font-bold text-gray-800">แก้ไขแผนก</h2>

            <div className="space-y-2">
                <div>
                    <label className="text-sm text-gray-600">รหัสแผนก</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.department_code}
                        onChange={(e) => setForm({ ...form, department_code: e.target.value })}
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">ชื่อไทย</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.name_th}
                        onChange={(e) => setForm({ ...form, name_th: e.target.value })}
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">ชื่ออังกฤษ</label>
                    <input
                        className="w-full border rounded px-2 py-1"
                        value={form.name_en}
                        onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">คำอธิบาย</label>
                    <textarea
                        className="w-full border rounded px-2 py-1"
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
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
