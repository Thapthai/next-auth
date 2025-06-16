"use client";

import { useState } from "react";
import CreateDirtyCard from "./CreateDirtyCard";
import DirtyDetailCard from "./DirtyDetailCard";
import AddQtyDirty from "./AddQtyDirty";

export default function Tab2() {
    const [step, setStep] = useState<"create" | "detail" | "qty">("create");
    const [formData, setFormData] = useState<any>(null);
    const [addedItems, setAddedItems] = useState<any[]>([]);

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
                    addedItems={addedItems}
                    onBackCreate={(createData) => {
                        setFormData({ ...formData, ...createData });
                        setStep("create");
                    }}
                    onNextAddQty={(detailData) => {
                        setFormData({ ...formData, ...detailData });;
                        setStep("qty");
                    }}
                />
            )}

            {step === "qty" && formData && (
                <AddQtyDirty
                    data={formData}
                    onSubmitDetail={(detailData) => {
                        setAddedItems((prev) => [
                            ...prev,
                            {
                                factory_id: formData.factory_id,
                                weighing_round: formData.weighing_round,
                                department_id: formData.selectedDepartment,
                                item: formData.selectedItem,
                                entries: detailData.entries,
                            },
                        ]);
                        setStep("detail");
                    }}
                    onBackDetail={(detailData) => {
                        setFormData({ ...formData, ...detailData });
                        setStep("detail");
                    }}
                />
            )}

        </>
    );
}
