"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "th", label: "ไทย", icon: "/icons/language/thailand.png" },
  { code: "en", label: "English", icon: "/icons/language/uk.png" },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleChangeLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    startTransition(() => {
      document.cookie = `locale=${newLocale}; path=/`;
      router.refresh();
    });
  };

  const currentLang = languages.find((lang) => lang.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending} className="flex items-center gap-2">
          {currentLang?.icon && (
            <img src={currentLang.icon} alt={currentLang.label} className="w-5 h-5 rounded-sm" />
          )}
          {currentLang?.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map(({ code, label, icon }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleChangeLocale(code)}
            className="flex items-center gap-2"
          >
            <img src={icon} alt={label} className="w-5 h-5 rounded-sm" />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
