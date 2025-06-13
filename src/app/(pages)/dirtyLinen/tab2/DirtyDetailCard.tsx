
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

// export default function DirtyDetailCard({
//     formData,
//     onBack,
//     onNext,
// }: {
//     formData: any;
//     onBack?: (data?: any) => void;
//     onNext: (detailData: any) => void;
// }) {

export default function DirtyDetailCard({
    formData,
    onBack,
    onNext,
}: {
    formData: any;
    onBack: (data: any) => void; // ไม่ใช่ optional แล้ว
    onNext: (detailData: any) => void;
}) {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [items, setItems] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [showNewItemModal, setShowNewItemModal] = useState(false);
    const [newItemName, setNewItemName] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000/departments")
            .then(res => res.json())
            .then(setDepartments)
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!selectedDepartment) {
            setItems([]);
            return;
        }
        fetch(`http://localhost:3000/items?department_id=${selectedDepartment}`)
            .then(res => res.json())
            .then(setItems)
            .catch(console.error);
    }, [selectedDepartment]);

    const filteredItems = searchTerm === ""
        ? items
        : items.filter(item =>
            item.name_th?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const handleCreateNewItem = async () => {
        const res = await fetch("http://localhost:3000/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name_th: newItemName,
                department_id: parseInt(selectedDepartment),
                material_id: 1,
                saleoffice_id: 2,
                item_category_id: 4,
                stock_location_id: 5,
                status: true,
            }),
        });
        const newItem = await res.json();
        setItems(prev => [...prev, newItem]);
        setSelectedItem(newItem);
        setShowNewItemModal(false);
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
                        <Label>เลือกสินค้า</Label>
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
                                    onClick={() => setShowNewItemModal(true)}
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
                        onBack({
                            factory_id: formData.factory_id,
                            weighing_round: formData.weighing_round,
                        });
                    }}
                >
                    ← กลับ
                </Button>

                <Button
                    disabled={!selectedDepartment || !selectedItem}
                    onClick={() =>
                        onNext({
                            selectedDepartment,
                            selectedItem,
                        })
                    }
                >
                    ถัดไป
                </Button>
            </CardFooter>

            {/* Modal เพิ่มสินค้าใหม่ */}
            <Dialog open={showNewItemModal} onOpenChange={setShowNewItemModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>เพิ่มสินค้าใหม่</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label>ชื่อสินค้า</Label>
                        <Input value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setShowNewItemModal(false)}>
                            ยกเลิก
                        </Button>
                        <Button onClick={handleCreateNewItem} disabled={!newItemName}>
                            เพิ่มสินค้า
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
