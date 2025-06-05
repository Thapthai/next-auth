"use client";

import { useEffect, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { PopcornIcon } from "lucide-react";
import { initSocket } from "@/lib/socket";
import { useSession } from "next-auth/react";

export function SocketAlert() {
  const [message, setMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(100);

  const { data: session } = useSession();
  const userId = session?.user?.id;


  useEffect(() => {
    // if (typeof userId !== "number") return;
    if (!userId) return;


    const socket = initSocket(userId.toString());
    socket.on('new-send-notification-user', (data) => {
      setMessage(data.message || 'คุณมีแจ้งเตือนใหม่');
      setProgress(100);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            setMessage(null);
            return 0;
          }
          return prev - 2;
        });
      }, 100);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 w-[300px] z-50">
      <Alert className="relative border bg-white shadow-lg">
        <PopcornIcon className="h-5 w-5 text-yellow-500" />
        <AlertTitle>Notification</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
        <div className="absolute bottom-0 left-0 h-1 bg-yellow-400 transition-all duration-100"
          style={{ width: `${progress}%` }} />
      </Alert>
    </div>
  );
}
