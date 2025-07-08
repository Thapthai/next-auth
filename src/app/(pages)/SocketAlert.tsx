"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { PopcornIcon } from "lucide-react";
import { initSocket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export function SocketAlert() {
  const t = useTranslations('socketAlert');
  const [message, setMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(100);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [canPlaySound, setCanPlaySound] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      audioRef.current = new Audio("/sounds/levelup.mp3");
      setCanPlaySound(true);
      window.removeEventListener('click', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);

    return () => window.removeEventListener('click', handleInteraction);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const socket = initSocket(userId.toString());
    socket.on('new-send-notification-user', (data) => {
      setMessage(data.message || t('defaultMessage'));
      setProgress(100);

      console.log('data', data);

      // ✅ เล่นเสียง
      if (canPlaySound && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.warn);
      }

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
        <AlertTitle>{t('title')}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
        <div className="absolute bottom-0 left-0 h-1 bg-yellow-400 transition-all duration-100"
          style={{ width: `${progress}%` }} />
      </Alert>
    </div>
  );
}
