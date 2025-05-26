"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertTriangle } from "lucide-react";

export default function UnauthorizedPage() {
  const t = useTranslations("Unauthorized");
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  const progressPercent = (countdown / 5) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center space-y-6 relative">
        <div className="flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="text-red-600 w-8 h-8" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">{t("topic")}</h1>
        <p className="text-gray-600">{t("content")}</p>

        <div className="flex justify-center items-center space-x-2 text-gray-500 text-sm">
          <Loader2 className="animate-spin w-4 h-4" />
          <span>{t("redirecting", { seconds: countdown })}</span>
        </div>

        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <Link
          href="/"
          className="inline-block px-6 py-2 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition"
        >
          {t("backHome") || "กลับหน้าแรก"}
        </Link>
      </div>
    </div>
  );
}
