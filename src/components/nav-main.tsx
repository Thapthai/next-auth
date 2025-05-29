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
import { useState } from "react";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

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

  const toggleDropdown = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
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
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu className="pl-3">
          {navMenu.map((item, idx) => {
            const hasSub = !!item.sub?.length
            return (
              <Collapsible key={idx} open={openIndex === idx}>
                <SidebarMenuItem className="flex justify-between items-center w-full py-1">
                  <Link
                    href={item.url}
                    className="flex items-center gap-2 w-full"
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span className="text-sm">{t(item.title)}</span>
                  </Link>

                  {hasSub && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleDropdown(idx)
                      }}
                      className="ml-auto p-1"
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
                      {item.sub?.map((subItem, subIdx) => (
                        <SidebarMenuSub key={subIdx}>
                          <Link
                            href={subItem.url}
                            className="flex items-center gap-2 py-1 text-sm text-gray-700"
                          >
                            {subItem.icon && <subItem.icon className="w-4 h-4" />}

                            {t(subItem.title)}
                          </Link>
                        </SidebarMenuSub>
                      ))}
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
