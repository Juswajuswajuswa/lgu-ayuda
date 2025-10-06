"use client";

import * as React from "react";
import {
  IconBox,
  IconBuilding,
  IconDashboard,
  IconFileDescription,
  IconFileReport,
  IconHelp,
  IconSearch,
  IconSettings,
  IconShield,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
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
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Staff",
      url: "/dashboard/staff",
      icon: IconUsers,
    },
    {
      title: "Barangay",
      url: "/dashboard/barangay",
      icon: IconBuilding,
    },
    {
      title: "Beneficiaries",
      url: "/dashboard/beneficiaries",
      icon: IconUserPlus,
    },
    {
      title: "Distribution",
      url: "/dashboard/distribution",
      icon: IconBox,
    },
    {
      title: "Ayuda",
      url: "/dashboard/ayuda",
      icon: IconShield,
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: IconFileDescription,
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: IconFileReport,
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
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
