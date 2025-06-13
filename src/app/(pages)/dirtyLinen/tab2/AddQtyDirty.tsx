"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



export default function AddQtyDirty({ data }: { data: any }) {
    const [entries, setEntries] = useState([{ qty: "", weight: "" }]);

    const handleChange = (index: number, field: "qty" | "weight", value: string) => {
        const updated = [...entries];
        updated[index][field] = value;
        setEntries(updated);
    };

    const addEntry = () => {
        setEntries([...entries, { qty: "", weight: "" }]);
    };

    const handleRemoveEntry = (index: number) => {
        setEntries((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCreateNewDirty = async () => {
        try {
            const dirtyRes = await fetch("http://localhost:3000/dirties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    factory_id: data.factory_id,
                    weighing_round: data.weighing_round,
                }),
            });

            const dirty = await dirtyRes.json();

            const dirtyDetailResponses = await Promise.all(
                entries.map((entry) =>
                    fetch("http://localhost:3000/dirty-details", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            dirty_id: dirty.id,
                            department_id: parseInt(data.selectedDepartment),
                            item_id: data.selectedItem.id,
                            unit_id: 3,
                            user_id: 7,
                            qty: parseFloat(entry.qty),
                            receive_qty: parseFloat(entry.qty),
                            weight: parseFloat(entry.weight),
                            is_cancel: false,
                            status: true,
                        }),
                    })
                )
            );

            const detailResults = await Promise.all(dirtyDetailResponses.map((res) => res.json()));
            console.log("เพิ่มสำเร็จ", detailResults);
            // alert("✅ บันทึกข้อมูลเรียบร้อยแล้ว");
            window.location.reload(); // ✅ รีโหลดหน้าเว็บ
        } catch (err) {
            console.error("❌ เกิดข้อผิดพลาด:", err);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>เพิ่มรายการน้ำหนักและจำนวน</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {entries.map((entry, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end relative border p-4 rounded-lg"
                    >
                        <div className="md:col-span-2">
                            <Label>จำนวน</Label>
                            <Input
                                type="number"
                                value={entry.qty}
                                onChange={(e) => handleChange(index, "qty", e.target.value)}
                                placeholder="จำนวน"
                                className="w-full"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <Label>น้ำหนัก</Label>
                            <Input
                                type="number"
                                value={entry.weight}
                                onChange={(e) => handleChange(index, "weight", e.target.value)}
                                placeholder="น้ำหนัก"
                                className="w-full"
                            />
                        </div>
                        {index !== 0 && (
                            <Button
                                variant="ghost"
                                className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                                onClick={() => handleRemoveEntry(index)}
                            >
                                ✕
                            </Button>
                        )}

                    </div>
                ))}

                <Button type="button" variant="secondary" onClick={addEntry}>
                    + เพิ่มรายการ
                </Button>
            </CardContent>


            <CardFooter className="flex justify-end">
                <Button onClick={handleCreateNewDirty}>บันทึกทั้งหมดลงฐานข้อมูล</Button>
            </CardFooter>
        </Card>
    );
}
