"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddQtyDirty({
    data,
    onSubmitDetail,
    onBackDetail,

}: {
    data: any;
    onSubmitDetail: (detailData: any) => void;
    onBackDetail: (detailData: any) => void;

}) {
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

    const handleShowNewDirty = async () => {
        const result = entries.map((e) => ({
            qty: parseFloat(e.qty),
            weight: parseFloat(e.weight),
            receive_qty: parseFloat(e.qty),
        }));

        onSubmitDetail({
            entries: result,
        });
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

            <CardFooter className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => {
                        onBackDetail({});
                    }}
                >
                    ⬅️ ย้อนกลับ
                </Button>

                <Button onClick={handleShowNewDirty}>
                    เพิ่มรายการ
                </Button>
            </CardFooter>
        </Card>
    );
}



