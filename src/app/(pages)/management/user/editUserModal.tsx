'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { User } from "@/types/users";
import { SaleOffice } from "@/types/saleOffice";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    user: User | null;
    refresh: () => void;
};

type Option = {
    id: number;
    name_th: string;
};

export default function EditUserModal({ open, setOpen, user, refresh }: Props) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        permission_id: 0,
        department_id: 0,
        sale_office_ids: [] as number[],
    });

    const [permissions, setPermissions] = useState<Option[]>([]);
    const [departments, setDepartments] = useState<Option[]>([]);
    const [saleOffices, setSaleOffices] = useState<SaleOffice[]>([]);

    useEffect(() => {
        async function fetchOptions() {
            const [permsRes, deptsRes, salesRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/permission`),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/departments`),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices`)
            ]);
            setPermissions(await permsRes.json());
            setDepartments(await deptsRes.json());
            setSaleOffices(await salesRes.json());
        }

        fetchOptions();
    }, []);

    // Load selected user
    useEffect(() => {
        if (user) {
            setForm({
                name: user.name.toString(),
                email: user.email.toString(),
                permission_id: user.permission_id,
                department_id: user.department_id,
                sale_office_ids: user.user_sale_office.map(s => s.sale_office_id),
            });
        }
    }, [user]);

    const handleSubmit = async () => {
        if (!user) return;

        console.log(form.sale_office_ids);

        try {
            // PATCH ข้อมูล user หลัก
            const resUser = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    permission_id: form.permission_id,
                }),
            });
            if (!resUser.ok) throw new Error("อัปเดตผู้ใช้ไม่สำเร็จ");

            // PATCH user_sale_offices (API แยก)
            const resOffices = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user-sale-offices/user/${user.id}/sale-offices`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user.id,
                    sale_office_ids: form.sale_office_ids,
                }),
            });
            if (!resOffices.ok) throw new Error("อัปเดตสาขาไม่สำเร็จ");

            setOpen(false);
            refresh();

        } catch (err) {
            alert("เกิดข้อผิดพลาดในการแก้ไข");
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>แก้ไขข้อมูลผู้ใช้ {form.name} | {form.email}</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                    <select
                        className="w-full border rounded px-2 py-1"
                        value={form.permission_id}
                        onChange={(e) => setForm({ ...form, permission_id: Number(e.target.value) })}
                    >
                        <option value="">เลือกสิทธิ์</option>
                        {permissions.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name_th}
                            </option>
                        ))}
                    </select>

                    {/* <select
                        className="w-full border rounded px-2 py-1"
                        value={form.department_id}
                        onChange={(e) => setForm({ ...form, department_id: Number(e.target.value) })}
                    >
                        <option value="">เลือกแผนก</option>
                        {departments.map(d => (
                            <option key={d.id} value={d.id}>
                                {d.name_th}
                            </option>
                        ))}
                    </select> */}

                    <div className="space-y-1">
                        <label className="font-medium">สาขาที่สังกัด</label>
                        {saleOffices.map(office => (
                            <div key={office.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={form.sale_office_ids.includes(office.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setForm({ ...form, sale_office_ids: [...form.sale_office_ids, office.id] });
                                        } else {
                                            setForm({ ...form, sale_office_ids: form.sale_office_ids.filter(id => id !== office.id) });
                                        }
                                    }}
                                />
                                <span>{office.site_office_name_th} </span>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="secondary" onClick={() => setOpen(false)}>ยกเลิก</Button>
                    <Button onClick={handleSubmit}>บันทึก</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
