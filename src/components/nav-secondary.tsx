"use client"

import * as React from "react"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
    permission?: number[]
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const [loadingUrl, setLoadingUrl] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Reset loading state when pathname changes
  useEffect(() => {
    if (loadingUrl) {
      // Clear loading state immediately when pathname changes
      setLoadingUrl(null)
    }
  }, [pathname])

  const handleNavigation = (url: string) => {
    if (url === pathname) return
    
    setLoadingUrl(url)
    router.push(url)
  }

  return (

    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isItemLoading = loadingUrl === item.url
            const isItemActive = pathname === item.url
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild
                  disabled={isItemLoading}
                  className={isItemLoading ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  <button
                    onClick={() => handleNavigation(item.url)}
                    className={`flex items-center gap-2 w-full text-left ${
                      isItemActive ? 'text-primary font-medium' : ''
                    }`}
                  >
                    {isItemLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <item.icon />
                    )}
                    <span>{item.title}</span>
                    {isItemLoading && (
                      <span className="text-xs text-gray-500 ml-auto">กำลังโหลด...</span>
                    )}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
          <LanguageSwitcher />

        </SidebarMenu>

      </SidebarGroupContent>
    </SidebarGroup>
  )
}
