import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CountLinen() {
    return <>
        <TabsContent value="countLinen">
            <Card>
                <CardHeader>
                    <CardTitle>จัดการการลาป่วย</CardTitle>
                    <CardDescription>
                        บันทึกและจัดการการลาป่วยของพนักงาน
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="sick-start">วันที่เริ่มลาป่วย</Label>
                            <Input id="sick-start" type="date" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sick-end">วันที่สิ้นสุดการลาป่วย</Label>
                            <Input id="sick-end" type="date" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sick-reason">เหตุผลการลาป่วย</Label>
                        <Input id="sick-reason" placeholder="ระบุอาการหรือเหตุผล" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>บันทึกการลาป่วย</Button>
                </CardFooter>
            </Card>
        </TabsContent></ >;
}
