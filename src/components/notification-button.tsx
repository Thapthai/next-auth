// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { IconMail } from "@tabler/icons-react";
// import { Loader2 } from "lucide-react"; // ✅ import ไอคอน loading
// import { useSession } from "next-auth/react";

// export function NotificationButton() {
//     const [count, setCount] = useState(0);
//     const [loading, setLoading] = useState(false); // ✅ เพิ่ม state loading
//     const { data: session } = useSession();
//     const userId = session?.user?.id;
//     const token = session?.user?.access_token;

//     useEffect(() => {
//         const fetchNotifications = async () => {
//             if (!userId || !token) return;
//             setLoading(true); // ✅ เริ่มโหลด

//             try {
//                 const res = await fetch(
//                     `http://localhost:3000/notifications/user-notification/${userId}`,
//                     {
//                         method: "GET",
//                         headers: {
//                             "Content-Type": "application/json",
//                             Authorization: `Bearer ${token}`,
//                         },
//                     }
//                 );

//                 if (res.ok) {
//                     const data = await res.json();
//                     setCount(data.count ?? 0);
//                 } else {
//                     console.error("Failed to fetch:", res.status);
//                 }
//             } catch (error) {
//                 console.error("Fetch error:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchNotifications();
//     }, [userId, token]);

//     return (
//         <div className="relative">
//             <Button
//                 size="icon"
//                 className="size-8 group-data-[collapsible=icon]:opacity-0"
//                 variant="outline"
//             >
//                 {loading ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                     <IconMail />
//                 )}
//                 <span className="sr-only">Inbox</span>
//             </Button>

//             {!loading && count > 0 && (
//                 <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 min-w-[1rem] px-[4px] items-center justify-center rounded-full bg-red-500 text-[10px] text-white shadow">
//                     {count > 9 ? "9+" : count}
//                 </span>
//             )}
//         </div>
//     );
// }


"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconMail } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function NotificationButton() {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]); // 🔔 รายการแจ้งเตือน
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const token = session?.user?.access_token;

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!userId || !token) return;
            setLoading(true);

            try {
                const res = await fetch(
                    `http://localhost:3000/notifications/user-notification/${userId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (res.ok) {
                    const data = await res.json();
                    setCount(data.count ?? 0);
                    setNotifications(data.notifications ?? []);
                }
            } catch (err) {
                console.error("Error fetching notifications", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [userId, token]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="relative">
                    <Button
                        size="icon"
                        className="size-8 group-data-[collapsible=icon]:opacity-0"
                        variant="outline"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <IconMail />
                        )}
                        <span className="sr-only">Inbox</span>
                    </Button>

                    {!loading && count > 0 && (
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 min-w-[1rem] px-[4px] items-center justify-center rounded-full bg-red-500 text-[10px] text-white shadow">
                            {count > 9 ? "9+" : count}
                        </span>
                    )}
                </div>
            </DropdownMenuTrigger>

          <DropdownMenuContent className="w-65" align="end">
                <DropdownMenuLabel>แจ้งเตือนของคุณ</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                    <DropdownMenuItem disabled>ไม่มีแจ้งเตือน</DropdownMenuItem>
                ) : (
                    notifications.map((noti, index) => (
                        <DropdownMenuItem key={index} className="whitespace-normal text-sm">
                            <div>
                                <div className="font-semibold">{noti.title}</div>
                                <div className="text-muted-foreground">{noti.message}</div>
                            </div>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
