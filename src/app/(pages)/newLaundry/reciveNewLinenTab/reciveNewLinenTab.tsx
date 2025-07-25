"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ItemEntry {
    item: any;
    qty: string;
    weight: string;
}

export default function ReciveNewLinenTab() {
    const t = useTranslations('newLaundry');
    const [selectedFactory, setSelectedFactory] = useState("");
    const [selectedRound, setSelectedRound] = useState("");
    const [factories, setFactories] = useState([]);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        fetch(`${baseUrl}/factories`)
            .then(res => res.json())
            .then(setFactories)
            .catch(console.error);
    }, []);

    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [items, setItems] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // เปลี่ยนจาก entries เป็น itemEntries ที่เก็บทั้ง item, qty, weight
    const [itemEntries, setItemEntries] = useState<ItemEntry[]>([]);
    const [currentQty, setCurrentQty] = useState("");
    const [currentWeight, setCurrentWeight] = useState("");

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

    const addItemEntry = () => {
        if (!selectedItem || !currentQty || !currentWeight) {
            alert("กรุณาเลือก item และกรอกจำนวน น้ำหนักให้ครบ");
            return;
        }

        const newEntry: ItemEntry = {
            item: selectedItem,
            qty: currentQty,
            weight: currentWeight
        };

        setItemEntries([...itemEntries, newEntry]);
        
        // รีเซ็ตฟอร์ม
        setSelectedItem(null);
        setCurrentQty("");
        setCurrentWeight("");
        setSearchTerm("");
    };

    const handleRemoveItemEntry = (index: number) => {
        setItemEntries((prev) => prev.filter((_, i) => i !== index));
    };

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
            name_th: newUnregisteredItem.name
        });
        setSearchTerm("");
    };

    const handleCreateNewNewLinen = async () => {
        if (itemEntries.length === 0) {
            alert("กรุณาเพิ่มรายการสินค้าอย่างน้อย 1 รายการ");
            return;
        }

        try {
            const newLinenRes = await fetch(`${baseUrl}/new-linens`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    factory_id: parseInt(selectedFactory),
                    department_id: parseInt(selectedDepartment),
                    total: itemEntries.reduce((sum, entry) => sum + Number(entry.qty || 0), 0),
                }),
            });

            const newLinen = await newLinenRes.json();

            const newLinenDetailResponses = await Promise.all(
                itemEntries.map((entry) =>
                    fetch(`${baseUrl}/new-linen-details?`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            new_linen_id: parseInt(newLinen.id),
                            department_id: parseInt(selectedDepartment),
                            item_id: parseInt(entry.item.id),
                            unit_id: 3,
                            qty: parseFloat(entry.qty),
                            receive_qty: parseFloat(entry.qty),
                            weight: parseFloat(entry.weight),
                            description: entry.item.name_th,
                            is_cancel: false,
                            status: true,
                        }),
                    })
                )
            );

            const detailResults = await Promise.all(newLinenDetailResponses.map((res) => res.json()));
            console.log("เพิ่มสำเร็จ", detailResults);
            alert(t('receiveTab.saveSuccess'));
            window.location.reload(); // ✅ รีโหลดหน้าเว็บ
        } catch (err) {
            console.error("❌ เกิดข้อผิดพลาด:", err);
            alert(t('receiveTab.saveError'));
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{t('receiveTab.createNewDocument')}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>{t('receiveTab.factory')}</Label>
                        <Select value={selectedFactory} onValueChange={setSelectedFactory}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('receiveTab.selectFactory')} />
                            </SelectTrigger>
                            <SelectContent>
                                {factories.map((f: any) => (
                                    <SelectItem key={f.id} value={f.id.toString()}>
                                        {f.name_th} / {f.name_en}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>{t('receiveTab.round')}</Label>
                        <Select value={selectedRound} onValueChange={setSelectedRound}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('receiveTab.selectRound')} />
                            </SelectTrigger>
                            <SelectContent>
                                {["5.00", "11.00", "00.00", "03.00", "12.00"].map((r) => (
                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                
                <CardContent className="space-y-4">
                    {/* แผนก */}
                    <div>
                        <Label>{t('receiveTab.selectDepartment')}</Label>
                        <select
                            className="w-full border rounded p-2"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                        >
                            <option value="">{t('receiveTab.selectDepartmentPlaceholder')}</option>
                            {departments.map((d: any) => (
                                <option key={d.id} value={d.id}>{d.name_th}</option>
                            ))}
                        </select>
                    </div>

                    {/* เลือก Item และใส่จำนวน น้ำหนัก */}
                    {selectedDepartment && (
                        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                            <h3 className="font-semibold text-lg">เพิ่มสินค้าใหม่</h3>
                            
                            {/* เลือก Item */}
                            <div>
                                <Label>{t('receiveTab.selectItem')}</Label>
                                <Input
                                    placeholder={t('receiveTab.searchItemPlaceholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="mb-2"
                                />
                                <div className="border rounded max-h-40 overflow-y-auto bg-white">
                                    {filteredItems.map((item: any) => (
                                        <div
                                            key={item.id}
                                            className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedItem?.id === item.id ? "bg-blue-100" : ""}`}
                                            onClick={() => setSelectedItem(item)}
                                        >
                                            {item.name_th || `${t('receiveTab.itemId')}: ${item.id}`}
                                        </div>
                                    ))}
                                    {filteredItems.length === 0 && searchTerm && (
                                        <div
                                            className="p-2 text-blue-600 cursor-pointer hover:underline"
                                            onClick={handleCreateNewUnregisteredItem}
                                        >
                                            + {t('receiveTab.addNewItem')} "{searchTerm}"
                                        </div>
                                    )}
                                </div>
                                {selectedItem && (
                                    <div className="mt-2 text-sm text-green-600">
                                        {t('receiveTab.selected')}: {selectedItem.name_th}
                                    </div>
                                )}
                            </div>

                            {/* ใส่จำนวนและน้ำหนัก */}
                            {selectedItem && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label>{t('receiveTab.quantity')}</Label>
                                        <Input
                                            type="number"
                                            value={currentQty}
                                            onChange={(e) => setCurrentQty(e.target.value)}
                                            placeholder={t('receiveTab.quantity')}
                                        />
                                    </div>
                                    <div>
                                        <Label>{t('receiveTab.weight')}</Label>
                                        <Input
                                            type="number"
                                            value={currentWeight}
                                            onChange={(e) => setCurrentWeight(e.target.value)}
                                            placeholder={t('receiveTab.weight')}
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button 
                                            type="button" 
                                            onClick={addItemEntry} 
                                            className="w-full bg-green-600 hover:bg-green-700"
                                        >
                                            + {t('receiveTab.addEntry')}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>

                {/* แสดงรายการที่เพิ่มแล้ว */}
                {itemEntries.length > 0 && (
                    <CardContent className="space-y-4">
                        <h3 className="font-semibold text-lg">รายการสินค้าที่เพิ่ม</h3>
                        {itemEntries.map((entry, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-blue-50 relative"
                            >
                                <div className="md:col-span-2">
                                    <Label>สินค้า</Label>
                                    <div className="p-2 bg-white rounded border">
                                        {entry.item.name_th}
                                    </div>
                                </div>
                                <div>
                                    <Label>{t('receiveTab.quantity')}</Label>
                                    <div className="p-2 bg-white rounded border">
                                        {entry.qty}
                                    </div>
                                </div>
                                <div>
                                    <Label>{t('receiveTab.weight')}</Label>
                                    <div className="p-2 bg-white rounded border">
                                        {entry.weight}
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleRemoveItemEntry(index)}
                                        title={t('receiveTab.removeItem')}
                                        className="w-full"
                                    >
                                        ลบ
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {/* ผลรวมจำนวน qty */}
                        <div className="text-right font-semibold text-lg">
                            {t('receiveTab.totalQuantity')}:{" "}
                            {itemEntries.reduce((sum, entry) => sum + Number(entry.qty || 0), 0)}
                        </div>
                    </CardContent>
                )}

                <CardFooter className="flex justify-end">
                    <Button 
                        onClick={handleCreateNewNewLinen}
                        disabled={itemEntries.length === 0}
                        className="px-8"
                    >
                        {t('receiveTab.saveAll')}
                    </Button>
                </CardFooter>
            </Card >
        </>
    )
}