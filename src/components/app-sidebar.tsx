"use client"
import * as React from "react"
import {
  Frame,
  Map,
  PieChart,
  Send,
} from "lucide-react"
import { NavMain } from "@/src/components/nav-main"
import { NavUser } from "@/src/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar"
import {User} from "@prisma/client";
type NavItem = {
  title: string;
  url: string;
  icon: string;
  isActive?: boolean;
  items?: NavItem[];
};

type AppSidebarProps = {
  data: NavItem[];
  user: User;
} & React.ComponentProps<typeof Sidebar>;

export default function AppSidebar({ data, user, ...props }: AppSidebarProps) {

  return (
      <Sidebar  variant="inset" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild  isActive={true}>
                <a href="#">
                  <div className="flex aspect-square size-8 text-2xl items-center justify-center rounded-full  text-sidebar-primary-foreground">
                      💰
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">BudgetEase</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
  )
}
