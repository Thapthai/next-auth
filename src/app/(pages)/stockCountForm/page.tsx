import { SiteHeader } from "@/components/site-header";
import { useTranslations } from "next-intl";

export default function StockCountForm() {
    const t = useTranslations('StockCountForm');
    return (
        <div>

            <SiteHeader headerTopic={t('headerTopic')} />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

                        StockCountForm
                    </div>
                </div>
            </div>
        </div>
    )
}