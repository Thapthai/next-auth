'use client';


import { SiteHeader } from "@/components/site-header";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import RoundTimeExpress from "./RoundTimeExpress";
import RoundTimeDirty from "./RoundTimeDirty";
import RoundTimeClean from "./RoundTimeClean";
import RoundTimeFactory from "./RoundTimeFactory";
import RoundTimeShelfCountExpressComponent from "./RoundTimeShelfCountExpress";
import { SaleOffice } from "@/types/saleOffice";
import { Factories } from "@/types/factories";

export default function TimePage() {
    const t = useTranslations("roundTime");
    const [activeTab, setActiveTab] = useState("roundTimeExpress");
    const [saleOffices, setSaleOffices] = useState<SaleOffice[]>([]);
    const [factories, setFactories] = useState<Factories[]>([]);
    const [loadingSaleOffices, setLoadingSaleOffices] = useState(false);
    const [loadingFactories, setLoadingFactories] = useState(false);
    const [error, setError] = useState("");

    const tabs = [
        { value: "roundTimeExpress", label: t("roundTimeExpress.headerTopic"), shortLabel: t("roundTimeExpress.headerTopic") },
        { value: "roundTimeShelfCountExpress", label: t("roundTimeShelfCountExpress.headerTopic"), shortLabel: t("roundTimeShelfCountExpress.headerTopic") },
        { value: "roundTimeDirty", label: t("roundTimeDirty.headerTopic"), shortLabel: t("roundTimeDirty.headerTopic") },
        { value: "roundTimeClean", label: t("roundTimeClean.headerTopic"), shortLabel: t("roundTimeClean.headerTopic") },
        { value: "roundTimeFactory", label: t("roundTimeFactory.headerTopic"), shortLabel: t("roundTimeFactory.headerTopic") }
    ];

    const fetchSaleOffices = async () => {
        setLoadingSaleOffices(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale-offices`);
            if (!res.ok) throw new Error("Failed to fetch sale offices");
            const data = await res.json();
            setSaleOffices(data.data || []);
        } catch (err) {
            console.error(err);
            setError("ไม่สามารถโหลดข้อมูลสำนักงานขายได้");
        } finally {
            setLoadingSaleOffices(false);
        }
    };


    const fetchFactories = async () => {
        setLoadingFactories(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/factories/paginated`);
            if (!res.ok) throw new Error("Failed to fetch factories");
            const data = await res.json();
            setFactories(data.data || []);
        } catch (err) {
            console.error(err);
            setError("ไม่สามารถโหลดข้อมูลโรงงานได้");
        } finally {
            setLoadingFactories(false);
        }
    };

    useEffect(() => {
        fetchSaleOffices();
        fetchFactories();
    }, []);

    return (
        <>
            <SiteHeader headerTopic={t("headerTopic")} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            {/* Mobile Dropdown */}
                            <div className="block md:hidden mb-4">
                                <Select value={activeTab} onValueChange={setActiveTab}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue>
                                            {tabs.find(tab => tab.value === activeTab)?.shortLabel}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tabs.map((tab) => (
                                            <SelectItem key={tab.value} value={tab.value}>
                                                {tab.shortLabel}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Desktop Tabs */}
                            <TabsList className="hidden md:grid w-full grid-cols-5">
                                {tabs.map((tab) => (
                                    <TabsTrigger key={tab.value} value={tab.value}>
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <RoundTimeExpress saleOffices={saleOffices} />
                            <RoundTimeShelfCountExpressComponent saleOffices={saleOffices} />
                            <RoundTimeDirty saleOffices={saleOffices} />
                            <RoundTimeClean saleOffices={saleOffices} />
                            <RoundTimeFactory factories={factories} />
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    );
}
