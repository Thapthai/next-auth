import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CleanLinen() {
    return <>
        <TabsContent value="cleanLinen">
            <Card>
                <CardHeader>
                    <CardTitle>จัดการการลาพักร้อน</CardTitle>
                    <CardDescription>
                        บันทึกและจัดการการลาพักร้อนของพนักงาน
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="vacation-start">วันที่เริ่มลาพักร้อน</Label>
                            <Input id="vacation-start" type="date" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vacation-end">วันที่สิ้นสุดการลาพักร้อน</Label>
                            <Input id="vacation-end" type="date" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="vacation-days">จำนวนวันลาคงเหลือ</Label>
                        <Input id="vacation-days" type="number" defaultValue="10" readOnly />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>บันทึกการลาพักร้อน</Button>
                </CardFooter>
            </Card>
        </TabsContent>
    </>;
}