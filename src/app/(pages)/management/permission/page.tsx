import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";


export default function PermissionMangementPage() {
    const t = useTranslations('DirtyLinen');

    return (
        <div>
            <SiteHeader headerTopic={t('headerTopic')} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                        99 Satu

                    </div>
                </div>
            </div>
        </div>
    );
}
