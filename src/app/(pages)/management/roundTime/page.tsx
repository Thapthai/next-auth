'use client';


import { SiteHeader } from "@/components/site-header";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RoundTimeExpress from "./RoundTimeExpress";
import CountLinen from "./CountLinen";
import RoundTimeDirty from "./RoundTimeDirty";
import WashLinen from "./WashLinen";
import CleanLinen from "./cleanLinen";

export default function TimePage() {
    const t = useTranslations("roundTime");

    return (
        <>
            <SiteHeader headerTopic="จัดการเวลา (Time Management)" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                        <Tabs defaultValue="sendLinen" className="w-full">
                            <TabsList className="grid w-full grid-cols-6">
                                <TabsTrigger value="roundTimeExpress">{t("roundTimeExpress.headerTopic")}</TabsTrigger>
                                <TabsTrigger value="countLinen">{t("countLinen")}</TabsTrigger>
                                <TabsTrigger value="roundTimeDirty">{t("roundTimeDirty.headerTopic")}</TabsTrigger>
                                <TabsTrigger value="cleanLinen">{t("cleanLinen")}</TabsTrigger>
                                <TabsTrigger value="washLinen">{t("washLinen")}</TabsTrigger>

                            </TabsList>

                            <RoundTimeExpress />
                            <CountLinen />
                            <RoundTimeDirty />
                            <CleanLinen />
                            <WashLinen />
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    );
}
