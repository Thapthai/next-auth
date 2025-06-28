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
      permission: [1, 2],
      sub: [
        {
          title: "general",
          url: "/dashboard",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "newLaundry",
          url: "/newLaundry",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "dirtyLinen",
          url: "/dirtyLinen",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "cleanLinen",
          url: "/cleanLinen",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "stockIn",
          url: "/dashboard",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "laundryClaim",
          url: "/dashboard",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "damagedHospital",
          url: "/dashboard",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "sendForFix",
          url: "/dashboard",
          icon: IconDashboard,
          permission: [1, 2],

        },
        {
          title: "returnLaundry",
          url: "/dashboard",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "shelfCount",
          url: "/dashboard",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "hospitalReturn",
          url: "/dashboard",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "sticker",
          url: "/dashboard",
          icon: IconDashboard,
          permission: [1, 2],

        }, {
          title: "calculatePercentage",
          url: "/dashboard",
          icon: IconDashboard,
          permission: [1, 2],
        }, {
          title: "stockCountForm",
          url: "/dashboard",
          icon: IconDashboard,
          permission: [1, 2],
        }, {
          title: "cleanDoc",
          url: "/dashboard",
          icon: IconDashboard,
          permission: [1, 2],

        }, {
          title: "dirtyDoc",
          url: "/dashboard",
          icon: IconDashboard,
          permission: [1, 2],
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
      title: "laundryFactory",
      url: "/laundryFactory",
      icon: IconChartBar,
      sub: [
        {
          title: "laundrySetting",
          url: "/laundryFactory/laundrySetting",
          icon: IconDashboard,
        }
      ]
    },
    {
      title: "management",
      url: "#",
      icon: IconSettings,
      permission: [1, 2],
      sub: [
        {
          title: "saleOffice",
          url: "/management/saleoffice",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "userMnagement",
          url: "/management/user",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "permissionManagement",
          url: "/management/permission",
          icon: IconDashboard,
          permission: [1, 2],
        }
      ]
    },
    {
      title: "catalog",
      url: "#",
      icon: IconUsers,
      permission: [1, 2],
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      permission: [1, 2],
      items: [
        {
          title: "Active Proposals",
          url: "#",
          permission: [1, 2],
        },
        {
          title: "Archived",
          url: "#",
          permission: [1, 2],
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      permission: [1, 2],
      items: [
        {
          title: "Active Proposals",
          url: "#",
          permission: [1, 2],
        },
        {
          title: "Archived",
          url: "#",
          permission: [1, 2],
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      permission: [1, 2],
      items: [
        {
          title: "Active Proposals",
          url: "#",
          permission: [1, 2],
        },
        {
          title: "Archived",
          url: "#",
          permission: [1, 2],
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
      permission: [1, 2],
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
      permission: [1, 2],
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
      permission: [1, 2],
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
      permission: [1, 2],
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
      permission: [1, 2],
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
      permission: [1, 2],
    },
  ],


}

// Function to filter navigation items by user permission
const filterNavByPermission = (navItems: any[], userRole: number) => {
  return navItems.filter(item => {
    // If item has no permission array, show it to everyone
    if (!item.permission) {
      return true;
    }
    
    // Check if user's role is in the permission array
    const hasPermission = item.permission.includes(userRole);
    
    // If item has sub-items, filter them too
    if (item.sub && Array.isArray(item.sub)) {
      const filteredSub = item.sub.filter((subItem: any) => {
        // If sub-item has no permission array, show it
        if (!subItem.permission) {
          return true;
        }
        return subItem.permission.includes(userRole);
      });
      
      // Only show parent item if it has permission or has visible sub-items
      return hasPermission || filteredSub.length > 0;
    }
    
    return hasPermission;
  });
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { data: session, status } = useSession();
  const role = session?.user?.permission ?? null; // ✅ role ของ user
  const isLoading = status === "loading";

  const filteredNavMain = role ? filterNavByPermission(data.navMain, role) : []
  const filteredDocuments = role ? filterNavByPermission(data.documents, role) : []
  const filteredNavSecondary = role ? filterNavByPermission(data.navSecondary, role) : []

  const user = {
    name: session?.user?.name ?? '',
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
        {/* <NavMain navMenu={data.navMain} /> */}
        <NavMain navMenu={filteredNavMain} />
        <NavDocuments items={filteredDocuments} />
        <NavSecondary items={filteredNavSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
