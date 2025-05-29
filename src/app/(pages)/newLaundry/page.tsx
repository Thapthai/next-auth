'use client';

import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from "next-intl";
import ReciveNewLinenTab from "./reciveNewLinenTab";
import SearchTab from "./searchTab";

export default function NewLaundryPage() {

    const t = useTranslations('NewLaundry');

    return (
        <div>
            <SiteHeader headerTopic={t('headerTopic')} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                        <Tabs defaultValue="ReciveNewLinenTab" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="ReciveNewLinenTab">{t('tab1')}</TabsTrigger>
                                <TabsTrigger value="SearchTab">{t('tab2')}</TabsTrigger>
                            </TabsList>
                            <ReciveNewLinenTab />
                            <SearchTab />
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>

    )
}
