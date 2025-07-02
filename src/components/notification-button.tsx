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
import { initSocket } from "@/lib/socket";

export function NotificationButton() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const take = 3;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const { data: session } = useSession();
    const userId = session?.user?.id;
    const token = session?.user?.access_token;

    const fetchNotifications = async (page = 0, append = false) => {
        if (!userId || !token) return;

        setLoading(true);
        try {
            const res = await fetch(
                `${baseUrl}/notifications/user-notification/${userId}?skip=${page * take}&take=${take}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.ok) {
                const data = await res.json();
                if (append) {
                    setNotifications((prev) => [...prev, ...data.notifications]);
                } else {
                    setNotifications(data.notifications);
                }
                // setCount(data.total ?? data.count ?? 0);
                setCount(data.unreadCount ?? 0);
                setHasMore((page + 1) * take < (data.total ?? 0));
            }
        } catch (err) {
            console.error("Error fetching notifications", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSeeMore = () => {
        const nextPage = page + 1;
        fetchNotifications(nextPage, true);
        setPage(nextPage);
    };

    const handleReadNotification = async (notiId: number) => {
        if (!token) return;

        try {
            const res = await fetch(`${baseUrl}/notifications/user-notification/${notiId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ is_read: true }),
            });

            if (res.ok) {
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === notiId ? { ...n, is_read: true } : n
                    )
                );
                setCount((prev) => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };


    useEffect(() => {
        fetchNotifications();
    }, [userId, token]);

    useEffect(() => {
        if (!userId || !token) return;

        try {
            const socket = initSocket(userId.toString());

            socket.on("new-send-notification-user", () => {
                setPage(0);
                fetchNotifications(0, false); // โหลดใหม่จากหน้าแรก
            });

            // Add error handling for socket connection
            socket.on('connect_error', (error) => {
                console.error('Socket connection error in notification button:', error);
            });

            return () => {
                if (socket) {
                    socket.off("new-send-notification-user");
                    socket.off('connect_error');
                    socket.disconnect();
                }
            };
        } catch (error) {
            console.error('Failed to initialize socket:', error);
        }
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

            <DropdownMenuContent className="w-65 max-h-[400px] overflow-y-auto" align="end">
                <DropdownMenuLabel>แจ้งเตือนของคุณ</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                    <DropdownMenuItem disabled>ไม่มีแจ้งเตือน</DropdownMenuItem>
                ) : (
                    <>

                        {notifications.map((noti, index) => (
                            <DropdownMenuItem
                                key={index}
                                className="whitespace-normal text-sm relative pr-4 cursor-pointer"
                                onClick={() => handleReadNotification(noti.id)}
                            >
                                <div className={`${!noti.is_read ? "font-semibold" : ""}`}>
                                    <div className="flex items-center gap-2">
                                        {!noti.is_read && (
                                            <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                                        )}
                                        <span>{noti.title}</span>
                                    </div>
                                    <div className="text-muted-foreground text-xs">{noti.message}</div>
                                </div>
                            </DropdownMenuItem>
                        ))}

                        {hasMore && (
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault(); // ป้องกัน Dropdown ปิด
                                    handleSeeMore();
                                }}
                            >
                                <div className="w-full text-left text-blue-500 text-sm">ดูเพิ่มเติม...</div>
                            </DropdownMenuItem>
                        )}
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

