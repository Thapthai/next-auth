"use client"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

const weighingRounds = ["5.00", "11.00", "00.00", "03.00", "12.00"];

export default function CreateDirtyCard({
    onNextDetail,
    defaultFormData,
}: {
    onNextDetail: (formData: any) => void;
    defaultFormData?: any;
}) {
    const [selectedFactory, setSelectedFactory] = useState(defaultFormData?.factory_id?.toString() || "");
    const [selectedRound, setSelectedRound] = useState(defaultFormData?.weighing_round || "");
    const [factories, setFactories] = useState([]);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        fetch(`${baseUrl}/factories`)
            .then(res => res.json())
            .then(setFactories)
            .catch(console.error);
    }, []);

    const handleSubmit = () => {
        const formData = {
            factory_id: parseInt(selectedFactory),
            weighing_round: selectedRound,
        };
        onNextDetail(formData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>สร้างเอกสารใหม่</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>Factory</Label>
                    <Select value={selectedFactory} onValueChange={setSelectedFactory}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="เลือกโรงงาน" />
                        </SelectTrigger>
                        <SelectContent>
                            {factories.map((factory: any) => (
                                <SelectItem key={factory.id} value={factory.id.toString()}>
                                    {factory.name_th} / {factory.name_en}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>รอบชั่งผ้า</Label>
                    <Select value={selectedRound} onValueChange={setSelectedRound}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="เลือกรอบ" />
                        </SelectTrigger>
                        <SelectContent>
                            {["5.00", "11.00", "00.00", "03.00", "12.00"].map((r) => (
                                <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSubmit} disabled={!selectedFactory || !selectedRound}>
                    ถัดไป
                </Button>
            </CardFooter>

        </Card>
    );
}

