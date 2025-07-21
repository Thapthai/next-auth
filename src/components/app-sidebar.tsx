"use client";

import * as React from "react"
import { IconInnerShadowTop } from "@tabler/icons-react"
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
import { data } from "@/sideMenu";


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
