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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        fetch(`${baseUrl}/items?department_id=${selectedDepartment}&with_out_id=2`)
            .then(res => res.json())
            .then(setItems)
            .catch(console.error);
    }, [selectedDepartment]);

    // ปิด dropdown เมื่อคลิกนอก component
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.dropdown-container')) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const addItemEntry = () => {
        if (!selectedItem) {
            alert("กรุณาเลือกสินค้าก่อน");
            return;
        }
        
        if (!currentQty || parseFloat(currentQty) <= 0) {
            alert("กรุณากรอกจำนวนที่ถูกต้อง (มากกว่า 0)");
            return;
        }
        
        if (!currentWeight || parseFloat(currentWeight) <= 0) {
            alert("กรุณากรอกน้ำหนักที่ถูกต้อง (มากกว่า 0)");
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
        
        alert(`เพิ่มสินค้า "${selectedItem.name_th}" เรียบร้อยแล้ว`);
    };

    const handleRemoveItemEntry = (index: number) => {
        setItemEntries((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCreateNewUnregisteredItem = async () => {
        if (!searchTerm.trim()) {
            alert("กรุณากรอกชื่อสินค้าที่ต้องการสร้าง");
            return;
        }

        try {
            const res = await fetch(`${baseUrl}/unregistered-items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    item_id: 2,
                    type_linen: "new_linen",
                    name: searchTerm.trim(),
                    type_linen_id: 0,
                    status: true,
                }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const newUnregisteredItem = await res.json();
            
            // สร้าง item object ที่สอดคล้องกับโครงสร้างข้อมูล
            const newItem = {
                id: newUnregisteredItem.id || newUnregisteredItem.item_id,
                name_th: newUnregisteredItem.name || searchTerm.trim()
            };

            // เพิ่มเข้าไปใน items list
            setItems(prev => [...prev, newItem]);
            
            // เลือก item ที่สร้างใหม่
            setSelectedItem(newItem);
            
            // เคลียร์ search term
            setSearchTerm("");
            
            alert("สร้างสินค้าใหม่สำเร็จ");
        } catch (error) {
            console.error("Error creating new unregistered item:", error);
            alert("เกิดข้อผิดพลาดในการสร้างสินค้าใหม่");
        }
    };

    const handleCreateNewNewLinen = async () => {
        // ตรวจสอบข้อมูลพื้นฐาน
        if (!selectedFactory) {
            alert("กรุณาเลือกโรงงาน");
            return;
        }
        
        if (!selectedDepartment) {
            alert("กรุณาเลือกแผนก");
            return;
        }
        
        if (itemEntries.length === 0) {
            alert("กรุณาเพิ่มรายการสินค้าอย่างน้อย 1 รายการ");
            return;
        }

        try {
            // สร้าง new linen
            const newLinenRes = await fetch(`${baseUrl}/new-linens`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    factory_id: parseInt(selectedFactory),
                    department_id: parseInt(selectedDepartment),
                    total: itemEntries.reduce((sum, entry) => sum + Number(entry.qty || 0), 0),
                }),
            });

            if (!newLinenRes.ok) {
                throw new Error(`Failed to create new linen: ${newLinenRes.status}`);
            }

            const newLinen = await newLinenRes.json();

            // สร้าง new linen details
            const newLinenDetailPromises = itemEntries.map(async (entry) => {
                const response = await fetch(`${baseUrl}/new-linen-details`, {
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
                });

                if (!response.ok) {
                    throw new Error(`Failed to create detail for item ${entry.item.name_th}: ${response.status}`);
                }

                return response.json();
            });

            await Promise.all(newLinenDetailPromises);

            console.log("เพิ่มสำเร็จ");
            alert(t('receiveTab.saveSuccess') || "บันทึกข้อมูลสำเร็จ");
            window.location.reload();
        } catch (err) {
            console.error("❌ เกิดข้อผิดพลาด:", err);
            alert(t('receiveTab.saveError') || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
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
                            <div className="relative dropdown-container">
                                <Label>{t('receiveTab.selectItem')}</Label>
                                <div className="relative">
                                    {/* Trigger ที่เหมือน SelectTrigger */}
                                    <button
                                        type="button"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                                    >
                                        <span className="flex-1 text-left">
                                            {selectedItem ? 
                                                selectedItem.name_th || `${t('receiveTab.itemId')}: ${selectedItem.id}` : 
                                                searchTerm || t('receiveTab.searchItemPlaceholder')
                                            }
                                        </span>
                                        <svg
                                            className={`h-4 w-4 opacity-50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                                
                                {/* Content ที่เหมือน SelectContent */}
                                {isDropdownOpen && (
                                    <div className="z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 absolute top-full mt-1 w-full">
                                        {/* Input สำหรับค้นหา */}
                                        <div className="p-2 border-b">
                                            <Input
                                                placeholder="พิมพ์เพื่อค้นหา..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="h-8"
                                                autoFocus
                                            />
                                        </div>
                                        
                                        {/* รายการสินค้า */}
                                        <div className="max-h-60 overflow-y-auto">
                                            {(() => {
                                                const filteredItems = searchTerm === ""
                                                    ? items
                                                    : items.filter(item =>
                                                        item.name_th?.toLowerCase().includes(searchTerm.toLowerCase())
                                                    );
                                                
                                                return (
                                                    <>
                                                        {filteredItems.length > 0 ? (
                                                            filteredItems.map((item: any) => (
                                                                <div
                                                                    key={item.id}
                                                                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                                    onClick={() => {
                                                                        setSelectedItem(item);
                                                                        setSearchTerm("");
                                                                        setIsDropdownOpen(false);
                                                                    }}
                                                                >
                                                                    <span className="font-medium">
                                                                        {item.name_th || `${t('receiveTab.itemId')}: ${item.id}`}
                                                                    </span>
                                                                    {selectedItem?.id === item.id && (
                                                                        <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                                                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : searchTerm ? (
                                                            <div
                                                                className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-blue-600"
                                                                onClick={() => {
                                                                    handleCreateNewUnregisteredItem();
                                                                    setIsDropdownOpen(false);
                                                                }}
                                                            >
                                                                <span className="mr-2">+</span>
                                                                <span>{t('receiveTab.addNewItem')} "{searchTerm}"</span>
                                                            </div>
                                                        ) : (
                                                            <div className="py-6 text-center text-sm text-muted-foreground">
                                                                {items.length === 0 ? "ไม่มีสินค้าในแผนกนี้" : "พิมพ์เพื่อค้นหาสินค้า"}
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                )}
                                
                                {/* แสดงสินค้าที่เลือก */}
                                {selectedItem && (
                                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm text-green-700 font-medium">
                                                    {t('receiveTab.selected')}: {selectedItem.name_th}
                                                </div>
                                                {selectedItem.description && (
                                                    <div className="text-xs text-green-600 mt-1">
                                                        {selectedItem.description}
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedItem(null)}
                                                className="text-green-700 hover:text-green-900 h-6 w-6 p-0"
                                            >
                                                ✕
                                            </Button>
                                        </div>
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