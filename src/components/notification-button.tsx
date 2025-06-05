import { Button } from "@/components/ui/button";
import { IconMail } from "@tabler/icons-react";


export function NotificationButton() {


    const count = 1
    return (
        <div className="relative">
            <Button
                size="icon"
                className="size-8 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
            >
                <IconMail />
                <span className="sr-only">Inbox</span>
            </Button>

            {count > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 min-w-[1rem] px-[4px] items-center justify-center rounded-full bg-red-500 text-[10px] text-white shadow">
                    {count > 9 ? "9+" : count}
                </span>
            )}
        </div>
    );
}
