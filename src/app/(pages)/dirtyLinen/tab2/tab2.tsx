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
                    onNext={(data) => {
                        setFormData(data);
                        setStep("detail");
                    }}
                />
            )}

            {step === "detail" && formData && (
                <DirtyDetailCard
                    formData={formData}
                    onBack={() => setStep("create")}
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
