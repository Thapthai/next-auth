import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShowDirty({ entries }: { entries: any[] }) {

  const handleCreateNewDirty = async () => {
    try {
      if (entries.length === 0) {
        alert("ไม่มีข้อมูลสำหรับบันทึก");
        return;
      }

      const factoryId = entries[0].factory_id;
      const weighingRound = entries[0].weighing_round;

      // สร้าง dirty แม่
      const dirtyRes = await fetch("http://localhost:3000/dirties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          factory_id: factoryId,
          // weighing_round: weighingRound,
        }),
      });

      const dirty = await dirtyRes.json();

      // ส่ง dirty-detail ตาม entries ย่อย
      const allDetailResponses = await Promise.all(
        entries.flatMap((mainEntry) =>
          (mainEntry.entries || []).map((e: any) =>
            fetch("http://localhost:3000/dirty-details", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                dirty_id: dirty.id,
                department_id: parseInt(mainEntry.department_id || mainEntry.selectedDepartment),
                item_id: mainEntry.item?.id || mainEntry.selectedItem?.id,
                unit_id: 3,
                user_id: 7,
                qty: parseFloat(e.qty),
                receive_qty: parseFloat(e.qty),
                weight: parseFloat(e.weight),
                is_cancel: false,
                status: true,
              }),
            })
          )
        )
      );

      alert("บันทึกข้อมูลเรียบร้อยแล้ว");
      window.location.reload();
    } catch (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };


  if (entries.length === 0) {
    return <p>ยังไม่มีข้อมูล</p>;
  }

  return (
    <CardContent>
      <Card className="space-y-4">
        {entries.map((mainEntry, idx) => (
          <div key={idx}>
            <CardHeader>
              <CardTitle>
                แผนก: {mainEntry.selectedDepartment || mainEntry.department_id} - สินค้า: {mainEntry.selectedItem?.name_th || mainEntry.item?.name_th}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mainEntry.entries?.map((e: any, i: number) => (
                <div key={i} className="flex justify-between border-b py-1 text-sm">
                  <span>deparetment id: {e.department_id}</span>
                  <span>จำนวน: {e.qty}</span>
                  <span>น้ำหนัก: {e.weight}</span>
                </div>
              )) || (
                  <div className="flex justify-between border-b py-1 text-sm">
                    <span>จำนวน: {mainEntry.qty}</span>
                    <span>น้ำหนัก: {mainEntry.weight}</span>
                  </div>
                )}
            </CardContent>
          </div>
        ))}

        <Button onClick={handleCreateNewDirty}>
          บันทึกทั้งหมดลงฐานข้อมูล
        </Button>
      </Card>
    </CardContent>
  );
}
