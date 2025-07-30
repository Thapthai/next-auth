import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function WashLinen() {
    return <>

        <TabsContent value="washLinen">
            <Card>
                <CardHeader>
                    <CardTitle>จัดการโอเวอร์ไทม์</CardTitle>
                    <CardDescription>
                        บันทึกและจัดการการทำงานล่วงเวลาของพนักงาน
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="overtime-date">วันที่ทำโอเวอร์ไทม์</Label>
                            <Input id="overtime-date" type="date" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="overtime-start">เวลาเริ่มโอเวอร์ไทม์</Label>
                            <Input id="overtime-start" type="time" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="overtime-end">เวลาสิ้นสุดโอเวอร์ไทม์</Label>
                            <Input id="overtime-end" type="time" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="overtime-reason">เหตุผลการทำโอเวอร์ไทม์</Label>
                        <Input id="overtime-reason" placeholder="ระบุเหตุผลการทำงานล่วงเวลา" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>บันทึกโอเวอร์ไทม์</Button>
                </CardFooter>
            </Card>
        </TabsContent>

    </>;
}