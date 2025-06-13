"use client";

import { useState } from "react";
import CreateDirtyCard from "./CreateDirtyCard";
import DirtyDetailCard from "./DirtyDetailCard";
import AddQtyDirty from "./AddQtyDirty";

export default function Tab2() {
    const [step, setStep] = useState<"create" | "detail" | "qty">("create");
    const [formData, setFormData] = useState<any>(null);

    return (
        <>
            {step === "create" && (
                <CreateDirtyCard
                    defaultFormData={formData} // ✅ ส่งกลับ default ค่าเดิมที่เคยเลือกไว้
                    onNext={(data) => {
                        setFormData(data);
                        setStep("detail");
                    }}
                />
            )}


            {step === "detail" && formData && (
                <DirtyDetailCard
                    formData={formData}
                    onBack={(backData) => {
                        setFormData({ ...formData, ...backData }); // รวมข้อมูลเดิม + ที่ส่งกลับมา
                        setStep("create");
                    }}
                    onNext={(detailData) => {
                        setFormData({ ...formData, ...detailData }); // รวมข้อมูลทั้งหมดไว้
                        setStep("qty");
                    }}
                />
            )}


            {step === "qty" && formData && <AddQtyDirty data={formData} />}
        </>
    );
}
