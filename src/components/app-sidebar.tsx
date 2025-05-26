"use client";

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { useSession } from "next-auth/react";



const data = {
  navMain: [
    {
      title: "general",
      url: "/dashboard",
      icon: IconDashboard,
      sub: [
        {
          title: "general",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "newLaundry",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "dirtyLinen",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "cleanLinen",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "stockIn",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "laundryClaim",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "damagedHospital",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "sendForFix",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "returnLaundry",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "shelfCount",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "hospitalReturn",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "sticker",
          url: "/dashboard",
          icon: IconDashboard,
        }, {
          title: "calculatePercentage",
          url: "/dashboard",
          icon: IconDashboard,
        }, {
          title: "stockCountForm",
          url: "/dashboard",
          icon: IconDashboard,
        }, {
          title: "cleanDoc",
          url: "/dashboard",
          icon: IconDashboard,
        }, {
          title: "dirtyDoc",
          url: "/dashboard",
          icon: IconDashboard,
        },
      ]
    },
    {
      title: "createStatus",
      url: "/setting",
      icon: IconListDetails,
      sub: [
        {
          title: "parDepartment",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "dirtyRequest",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "departmentTransfer",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "otherRequest",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "chartroom",
          url: "/dashboard",
          icon: IconDashboard,
        },
      ]
    },
    {
      title: "contract",
      url: "#",
      icon: IconChartBar,
      sub: [
        {
          title: "laundryContract",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "hospitalContract",
          url: "/dashboard",
          icon: IconDashboard,
        },
      ]
    },
    {
      title: "report",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "system",
      url: "#",
      icon: IconUsers,
    },
    {
      title: "catalog",
      url: "#",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {


  const { data: session, status } = useSession();
  const name = session?.user?.name ?? "Guest";
  const isLoading = status === "loading";

  const user = {
    name: session?.user?.name ?? 'Guest',
    email: session?.user?.email ?? '',
    avatar: "",
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >

              <Link href="/">
                <img
                  src="https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg"
                  alt="Logo"
                  className="w-6 h-6 mr-2 inline-block rounded"
                />
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Nlinen</span>
              </Link>

            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain navMenu={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
