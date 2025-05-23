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
          title: "บันทึกผ้าใหม่ส่งซัก",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "บันทึกรับผ้าสกปก",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "บันทึกรับผ้าสะอาด",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "บันทึกรับเข้าสต๊อก",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "บันทึกส่งเครมโรงซัก(โรงซัก)",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "บันทึกผ้าชำรุด(โรงพยาบาล)",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "บันทึกส่งผ้าแก้ไข",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "บันทึกส่งผ้ารับกลับ",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "Shelf Count",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "บันทึกรับการคืนผ้า(โรงพยาบาล)",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "สติ๊กเกอร์",
          url: "/dashboard",
          icon: IconDashboard,
        }, {
          title: "คิดเป็นเปอร์เซ็นต์",
          url: "/dashboard",
          icon: IconDashboard,
        }, {
          title: "แบบฟอร์มการนับสต๊อก",
          url: "/dashboard",
          icon: IconDashboard,
        }, {
          title: "บันทึกเอกสารผ้าสะอาด โรงซัก",
          url: "/dashboard",
          icon: IconDashboard,
        }, {
          title: "บันทึกเอกสารผ้าสกปรก โรงซัก",
          url: "/dashboard",
          icon: IconDashboard,
        },
      ]
    },
    {
      title: "Create Status",
      url: "/setting",
      icon: IconListDetails,
      sub: [
        {
          title: "Par Department",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "เรียกเก็บผ้าสกปก",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "ย้ายแผนก",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "การร้องขออื่น ๆ",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "Chartroom",
          url: "/dashboard",
          icon: IconDashboard,
        },
      ]
    },
    {
      title: "คู่สัญญา",
      url: "#",
      icon: IconChartBar,
      sub: [
        {
          title: "คู่สัญญาโรงซัก",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "คู่สัญญาโรงพยาบาล",
          url: "/dashboard",
          icon: IconDashboard,
        },
      ]
    },
    {
      title: "รายงาน",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "ระบบ",
      url: "#",
      icon: IconUsers,
    },
    {
      title: "Catalog",
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
