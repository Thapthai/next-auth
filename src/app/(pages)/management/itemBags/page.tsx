import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconPlus, IconReload, IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function ItemBagsPage() {
    const t = useTranslations("ItemBags");

    return (
        <div>
            <SiteHeader headerTopic={t("headerTopic")} />

            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        <div className="flex flex-col gap-4">
                            <form className="flex gap-2">
                                <Input placeholder={t("searchPlaceholder")} />
                                <Button type="button" variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600">
                                    <IconReload />
                                </Button>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600">
                                    <IconSearch />
                                    {t("search")}
                                </Button>
                                <Button type="button" variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600">
                                    <IconPlus />
                                    {t("createNewItemBag")}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}