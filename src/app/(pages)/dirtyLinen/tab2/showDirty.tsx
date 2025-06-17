import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // ใช้ icon จาก lucide-react


function mergeDuplicateEntries(entries: any[]) {
  const grouped = new Map<string, any>();

  for (const entry of entries) {
    const departmentId = entry.department_id;
    const itemKey = entry.items?.name_th || entry.items?.id || entry.item?.name_th || entry.item?.id;
    const key = `${departmentId}-${itemKey}`;

    if (!grouped.has(key)) {
      grouped.set(key, {
        ...entry,
        entries: [...entry.entries],
      });
    } else {
      const existing = grouped.get(key);
      existing.entries = [...existing.entries, ...entry.entries];
    }
  }

  return Array.from(grouped.values());
}


export default function ShowDirty({ entries }: { entries: any[] }) {

  const mergedEntries = mergeDuplicateEntries(entries);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleCreateNewDirty = async () => {
    try {
      if (mergedEntries.length === 0) {
        alert("ไม่มีข้อมูลสำหรับบันทึก");
        return;
      }

      const factoryId = mergedEntries[0].factory_id;

      const dirtyRes = await fetch(`${baseUrl}/dirties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          factory_id: factoryId
        }),
      });
      const dirty = await dirtyRes.json();


      for (const mainEntry of mergedEntries) {
        const departmentId = parseInt(mainEntry.department_id || mainEntry.selectedDepartment);

        const itemId = mainEntry.items?.id;
        const unregistered_item_id = mainEntry.items?.unregistered_item_id ?? null;
        const totalQty = mainEntry.entries?.reduce((sum: number, e: any) => sum + parseFloat(e.qty || 0), 0) || 0;
        const totalWeight = mainEntry.entries?.reduce((sum: number, e: any) => sum + parseFloat(e.weight || 0), 0) || 0;

        const dirtyDetailRes = await fetch(`${baseUrl}/dirty-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dirty_id: dirty.id,
            department_id: departmentId,
            item_id: itemId,
            unit_id: 3,
            user_id: 7,
            qty: parseFloat(totalQty),
            receive_qty: parseFloat(totalQty),
            weight: parseFloat(totalWeight),
            unregistered_item_id: unregistered_item_id,
            is_cancel: false,
            status: true,
          }),
        });
        const dirtyDetail = await dirtyDetailRes.json();

        for (const e of mainEntry.entries || []) {
          await fetch(`${baseUrl}/dirty-detail-rounds`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              dirty_detail_id: dirtyDetail.id,
              item_id: itemId,
              unit_id: 3,
              user_id: 7,
              qty: parseFloat(e.qty),
              receive_qty: parseFloat(e.qty),
              weight: parseFloat(e.weight),
              is_cancel: false,
              status: true,
            }),
          });
        }
      }

      alert("บันทึกข้อมูลเรียบร้อยแล้ว");
      window.location.reload();
    } catch (err) {
      console.error("❌ เกิดข้อผิดพลาด:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({}); // บันทึก state เปิด/ปิด

  const toggleExpand = (idx: number) => {
    setExpanded((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };


  if (mergedEntries.length === 0) {
    return <p>ยังไม่มีข้อมูล</p>;
  }


  return (
    <CardContent>
      <Card className="space-y-4">
        {mergedEntries.map((mainEntry, idx) => {
          const totalQty =
            mainEntry.entries?.reduce((sum: number, e: any) => sum + parseFloat(e.qty || 0), 0) || 0;
          const totalWeight =
            mainEntry.entries?.reduce((sum: number, e: any) => sum + parseFloat(e.weight || 0), 0) || 0;

          return (
            <div key={idx}>
              <CardHeader
                className="cursor-pointer flex items-center justify-between"
                onClick={() => toggleExpand(idx)}
              >
                <CardTitle>
                  แผนก: {mainEntry.selectedDepartment || mainEntry.department_id} - สินค้า:{" "}
                  {mainEntry.items?.id} {mainEntry.items?.name_th}
                </CardTitle>
                <div>{expanded[idx] ? <ChevronUp /> : <ChevronDown />}</div>
              </CardHeader>

              <CardContent className="space-y-1">
                {mainEntry.entries?.length > 0 && (
                  <div className="flex justify-between font-semibold pt-2 mt-2 text-sm">
                    <span>รวมทั้งหมด</span>
                    <span>จำนวนรวม: {totalQty}</span>
                    <span>น้ำหนักรวม: {totalWeight}</span>
                  </div>
                )}

                {expanded[idx] && mainEntry.entries?.length > 0 && (
                  <div className="pt-2">
                    {mainEntry.entries.map((e: any, i: number) => (
                      <div
                        key={i}
                        className="flex justify-between border-b py-1 text-sm text-muted-foreground"
                      >
                        <span>department_id: {mainEntry.department_id}</span>
                        <span>จำนวน: {e.qty}</span>
                        <span>น้ำหนัก: {e.weight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </div>
          );
        })}
        <CardFooter className="flex justify-end">

          <Button onClick={handleCreateNewDirty}>บันทึก</Button>
        </CardFooter>
      </Card>
    </CardContent>
  );
}
