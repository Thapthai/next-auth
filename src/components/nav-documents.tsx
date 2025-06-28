"use client"

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: Icon
    permission?: number[]
  }[]
}) {
  const { isMobile } = useSidebar()
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
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isItemLoading = loadingUrl === item.url
          const isItemActive = pathname === item.url
          
          return (
            <SidebarMenuItem key={item.name}>
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
                  <span>{item.name}</span>
                  {isItemLoading && (
                    <span className="text-xs text-gray-500 ml-auto">กำลังโหลด...</span>
                  )}
                </button>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    className="data-[state=open]:bg-accent rounded-sm"
                    disabled={isItemLoading}
                  >
                    <IconDots />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-24 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <IconFolder />
                    <span>Open</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconShare3 />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <IconTrash />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )
        })}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <IconDots className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
