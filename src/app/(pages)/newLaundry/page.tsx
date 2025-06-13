'use client';

import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from "next-intl";
import ReciveNewLinenTab from "./reciveNewLinenTab/reciveNewLinenTab";
import SearchTab from "./searchTab/searchTab";

export default function NewLaundryPage() {

    const t = useTranslations('NewLaundry');

    return (
        <div>
            <SiteHeader headerTopic={t('headerTopic')} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                        <Tabs defaultValue="SearchTab" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="SearchTab">{t('tab2')}</TabsTrigger>
                                <TabsTrigger value="ReciveNewLinenTab">{t('tab1')}</TabsTrigger>
                            </TabsList>
                            <TabsContent value="SearchTab">
                                <SearchTab />
                            </TabsContent>
                            <TabsContent value="ReciveNewLinenTab">
                                <ReciveNewLinenTab />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>

    )
}
