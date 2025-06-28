"use client"

import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { ChevronDown, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { NotificationButton } from "./notification-button";
import { useRouter, usePathname } from "next/navigation";

type Icon = React.ComponentType<{ className?: string }>

interface PropsNavItem {
  navMenu: {
    title: string,
    url: string,
    icon?: Icon,
    sub?: {
      title: string,
      url: string,
      icon?: Icon,
    }[]
  }[]
}

export function NavMain({ navMenu }: PropsNavItem) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [loadingUrl, setLoadingUrl] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Reset loading state when pathname changes (navigation completes)
  useEffect(() => {
    if (loadingUrl) {
      // Clear loading state immediately when pathname changes
      setLoadingUrl(null)
    }
  }, [pathname])

  const toggleDropdown = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const handleNavigation = (url: string) => {
    if (url === pathname) return // ไม่ต้อง navigate ถ้าอยู่หน้าเดิม
    
    setLoadingUrl(url)
    router.push(url)
  }

  const t = useTranslations('SideMenu');

  return (

    <SidebarGroup>
      <SidebarGroupLabel>{t('headerTopic')}</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <NotificationButton />

          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu className="pl-3">
          {navMenu.map((item, idx) => {
            const hasSub = !!item.sub?.length
            const isItemLoading = loadingUrl === item.url
            const isItemActive = pathname === item.url
            
            return (
              <Collapsible key={idx} open={openIndex === idx}>
                <SidebarMenuItem className="flex justify-between items-center w-full py-1">
                  <button
                    onClick={() => handleNavigation(item.url)}
                    disabled={isItemLoading}
                    className={`flex items-center gap-2 w-full text-left transition-colors duration-200 ${
                      isItemActive 
                        ? 'text-primary font-medium bg-primary/10 rounded-md px-2 py-1' 
                        : 'hover:text-primary hover:bg-gray-100 rounded-md px-2 py-1'
                    } ${
                      isItemLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isItemLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      item.icon && <item.icon className="w-4 h-4" />
                    )}
                    <span className="text-sm">{t(item.title)}</span>
                    {isItemLoading && (
                      <span className="text-xs text-gray-500 ml-auto">กำลังโหลด...</span>
                    )}
                  </button>

                  {hasSub && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleDropdown(idx)
                      }}
                      className="ml-auto p-1 hover:bg-gray-100 rounded"
                      disabled={isItemLoading}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${openIndex === idx ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                  )}
                </SidebarMenuItem>
                {hasSub && (
                  <CollapsibleContent className="">
                    <SidebarMenu>
                      {item.sub?.map((subItem, subIdx) => {
                        const isSubItemLoading = loadingUrl === subItem.url
                        const isSubItemActive = pathname === subItem.url
                        
                        return (
                          <SidebarMenuSub key={subIdx}>
                            <button
                              onClick={() => handleNavigation(subItem.url)}
                              disabled={isSubItemLoading}
                              className={`flex items-center gap-2 py-1 text-sm w-full text-left transition-colors duration-200 ${
                                isSubItemActive 
                                  ? 'text-primary font-medium bg-primary/10 rounded-md px-2' 
                                  : 'text-gray-700 hover:text-primary hover:bg-gray-100 rounded-md px-2'
                              } ${
                                isSubItemLoading ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {isSubItemLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                subItem.icon && <subItem.icon className="w-4 h-4" />
                              )}
                              {t(subItem.title)}
                              {isSubItemLoading && (
                                <span className="text-xs text-gray-500 ml-auto">กำลังโหลด...</span>
                              )}
                            </button>
                          </SidebarMenuSub>
                        )
                      })}
                    </SidebarMenu>
                  </CollapsibleContent>
                )}
              </Collapsible>
            )
          })}
        </SidebarMenu>

      </SidebarGroupContent>
    </SidebarGroup>
  )
}
