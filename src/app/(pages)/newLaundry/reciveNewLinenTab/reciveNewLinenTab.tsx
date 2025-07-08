"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";


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
        try {
            const newLinenRes = await fetch(`${baseUrl}/new-linens`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    factory_id: parseInt(selectedFactory),
                    department_id: parseInt(selectedDepartment),
                    total: entries.reduce((sum, entry) => sum + Number(entry.qty || 0), 0),
                }),
            });

            const newLinen = await newLinenRes.json();

            const newLinenDetailResponses = await Promise.all(
                entries.map((entry) =>
                    fetch(`${baseUrl}/new-linen-details?`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            new_linen_id: parseInt(newLinen.id),
                            department_id: parseInt(selectedDepartment),
                            item_id: parseInt(selectedItem.id),
                            unit_id: 3,
                            qty: parseFloat(entry.qty),
                            receive_qty: parseFloat(entry.qty),
                            weight: parseFloat(entry.weight),
                            description: selectedItem.name_th,
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

                    {/* Combobox สินค้า */}
                    {selectedDepartment && (
                        <div>
                            <Label>{t('receiveTab.selectItem')}</Label>
                            <Input
                                placeholder={t('receiveTab.searchItemPlaceholder')}
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
                                        {item.name_th || `${t('receiveTab.itemId')}: ${item.id}`}
                                    </div>
                                ))}
                                {filteredItems.length === 0 && (
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
                    )}
                </CardContent>
                {selectedItem && (
                    <CardContent className="space-y-6">
                        {entries.map((entry, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg relative bg-muted/40"
                            >
                                <div className="md:col-span-2">
                                    <Label htmlFor={`qty-${index}`}>{t('receiveTab.quantity')}</Label>
                                    <Input
                                        id={`qty-${index}`}
                                        type="number"
                                        value={entry.qty}
                                        onChange={(e) => handleChange(index, "qty", e.target.value)}
                                        placeholder={t('receiveTab.quantity')}
                                        className="w-full"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor={`weight-${index}`}>{t('receiveTab.weight')}</Label>
                                    <Input
                                        id={`weight-${index}`}
                                        type="number"
                                        value={entry.weight}
                                        onChange={(e) => handleChange(index, "weight", e.target.value)}
                                        placeholder={t('receiveTab.weight')}
                                        className="w-full"
                                    />
                                </div>

                                {index !== 0 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                                        onClick={() => handleRemoveEntry(index)}
                                        title={t('receiveTab.removeItem')}
                                    >
                                        ✕
                                    </Button>
                                )}
                            </div>
                        ))}

                        <Button type="button" variant="secondary" onClick={addEntry} className="w-full md:w-auto">
                            + {t('receiveTab.addEntry')}
                        </Button>

                        {/* ผลรวมจำนวน qty */}
                        <div className="text-right font-semibold">
                            {t('receiveTab.totalQuantity')}:{" "}
                            {entries.reduce((sum, entry) => sum + Number(entry.qty || 0), 0)}
                        </div>
                    </CardContent>
                )}

                <CardFooter className="flex justify-end">
                    <Button onClick={handleCreateNewNewLinen}>{t('receiveTab.saveAll')}</Button>
                </CardFooter>
            </Card >

        </>
    )

}