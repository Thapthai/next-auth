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
                    defaultFormData={formData}
                    onNextDetail={(createData) => {
                        setFormData(createData);
                        setStep("detail");
                    }}
                />
            )}

            {step === "detail" && formData && (

                <DirtyDetailCard
                    formData={formData}
                    onBackCreate={(createData) => {
                        setFormData({ ...formData, ...createData }); // รวมค่าเดิม + ค่าเลือกแผนก/สินค้า
                        setStep("create");
                    }}
                    onNextAddQty={(detailData) => {
                        setFormData({ ...formData, ...detailData }); // รวมค่าเลือกปัจจุบัน
                        setStep("qty");
                    }}
                />

            )}

            {step === "qty" && formData && (
                <AddQtyDirty
                    data={formData}
                    onBackDetail={(detailData) => {
                        setFormData({ ...formData, ...detailData });
                        setStep("detail");
                    }}
                />
            )}
        </>
    );
}
