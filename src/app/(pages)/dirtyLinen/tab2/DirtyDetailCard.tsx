"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import ShowDirty from "./showDirty";

export default function DirtyDetailCard({
    formData,
    addedItems,
    onBackCreate,
    onNextAddQty,
}: {
    formData: any;
    addedItems: any[];
    onBackCreate: (data: any) => void;
    onNextAddQty: (detailData: any) => void;
}) {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(formData?.selectedDepartment || "");
    const [items, setItems] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState<any>(formData?.selectedItem || null);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


    useEffect(() => {
        fetch(`${baseUrl}/departments`)
            .then(res => res.json())
            .then(setDepartments)
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!selectedDepartment) {
            setItems([]);
            return;
        }
        fetch(`${baseUrl}/items?department_id=${selectedDepartment}?with_out_id=2`)
            .then(res => res.json())
            .then(setItems)
            .catch(console.error);
    }, [selectedDepartment]);

    const filteredItems = searchTerm === ""
        ? items
        : items.filter(item =>
            item.name_th?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const handleCreateNewUnregisteredItem = async () => {
        const res = await fetch(`${baseUrl}/unregistered-items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                item_id: 2,
                type_linen: "new_linen",
                name: searchTerm,
                type_linen_id: 0,
                status: true,
            }),
        });
        const newUnregisteredItem = await res.json();
        setItems(prev => [...prev, newUnregisteredItem]);
        setSelectedItem({
            id: newUnregisteredItem.item_id,
            unregistered_item_id: newUnregisteredItem.id,
            name_th: newUnregisteredItem.name
        });
        setSearchTerm("");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    รายละเอียด: โรงงาน {formData.factory_id} / รอบ {formData.weighing_round}
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                {/* แผนก */}
                <div>
                    <Label>เลือกแผนก</Label>
                    <select
                        className="w-full border rounded p-2"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        <option value="">-- เลือกแผนก --</option>
                        {departments.map((d: any) => (
                            <option key={d.id} value={d.id}>{d.name_th}</option>
                        ))}
                    </select>
                </div>

                {/* Combobox สินค้า */}
                {selectedDepartment && (
                    <div>
                        <Label>เลือกรายการ</Label>
                        <Input
                            placeholder="ค้นหาสินค้า..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-2"
                        />
                        <div className="border rounded max-h-40 overflow-y-auto">
                            {filteredItems.map((item: any) => (
                                <div
                                    key={item.id}
                                    className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedItem?.id === item.id ? "bg-blue-100" : ""}`}
                                    onClick={() => setSelectedItem(item)}
                                >
                                    {item.name_th || `Item ID: ${item.id}`}
                                </div>
                            ))}
                            {filteredItems.length === 0 && (
                                <div
                                    className="p-2 text-blue-600 cursor-pointer hover:underline"
                                    onClick={handleCreateNewUnregisteredItem}
                                >
                                    + เพิ่มสินค้าใหม่ "{searchTerm}"
                                </div>
                            )}
                        </div>
                        {selectedItem && (
                            <div className="mt-2 text-sm text-green-600">
                                เลือกแล้ว: {selectedItem.name_th}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => {
                        onBackCreate({
                            factory_id: formData.factory_id,
                            weighing_round: formData.weighing_round,
                        });
                    }}
                >
                    ← กลับ
                </Button>

                <Button
                    disabled={!selectedDepartment || !selectedItem}
                    onClick={() => {
                        onNextAddQty({
                            selectedDepartment,
                            factory_id: formData.factory_id,
                            weighing_round: formData.weighing_round,
                            selectedItem,
                        });
                    }}
                >
                    เพิ่มรายการ
                </Button>
            </CardFooter>


            {addedItems && addedItems.length > 0 && (
                <ShowDirty entries={addedItems} />
            )}

        </Card>
    );
}
