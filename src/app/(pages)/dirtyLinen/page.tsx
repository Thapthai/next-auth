import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import Tab1 from "./tab1/tab1";
import Tab2 from "./tab2/tab2";

export default function DirtyLinenPage() {
    const t = useTranslations('DirtyLinen');

    return (
        <div>
            <SiteHeader headerTopic={t('headerTopic')} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                        <Tabs defaultValue="tab1" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="tab1">{t('tab1')}</TabsTrigger>
                                <TabsTrigger value="tab2">{t('tab2')}</TabsTrigger>
                            </TabsList>
                            <TabsContent value="tab1">
                                <Tab1 />
                            </TabsContent>
                            <TabsContent value="tab2">
                                <Tab2 />
                            </TabsContent>
                        </Tabs>

                    </div>
                </div>
            </div>
        </div>
    );
}
