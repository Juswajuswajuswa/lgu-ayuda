"use client";

import * as React from "react";
import {
  IconBox,
  IconBuilding,
  IconDashboard,
  IconFileDescription,
  IconFileText,
  IconShield,
  IconShoppingBag,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "../public/Logo.png";
import Image from "next/image";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      role: ["admin"],
    },
    {
      title: "Staff",
      url: "/dashboard/staff",
      icon: IconUsers,
      role: ["admin"],
    },
    {
      title: "Barangay",
      url: "/dashboard/barangay",
      icon: IconBuilding,
      role: ["admin"],
    },
    {
      title: "Goods",
      url: "/dashboard/goods",
      icon: IconShoppingBag,
      role: ["admin"],
    },
    {
      title: "Ayuda",
      url: "/dashboard/ayuda",
      icon: IconShield,
      role: ["admin"],
    },
    {
      title: "Beneficiaries",
      url: "/dashboard/beneficiaries",
      icon: IconUserPlus,
      role: ["admin", "encoder"],
    },
    {
      title: "Applications",
      url: "/dashboard/applications",
      icon: IconFileText,
      role: ["admin", "validator"],
    },
    {
      title: "Distribution",
      url: "/dashboard/distributions",
      icon: IconBox,
      role: ["admin", "distributer"],
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: IconFileDescription,
      role: ["admin"],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <Image src={Logo} alt="Logo" width={20} height={20} />
                <span className="text-base font-semibold">LGU Ayuda</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
