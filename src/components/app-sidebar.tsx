"use client"
import * as React from "react"
import {
  BookOpen,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
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
import {GradientHeading} from "@/src/components/ui/cult/gradientheading";
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Suivi des dépenses",
          url: "#",
        },
        {
          title: "Départements",
          url: "#",
        },

      ],
    },

    {
      title: "Besoins",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Faire une demande",
          url: "#",
        },
        {
          title: "Gestion des Besoins",
          url: "#",
        },
        {
          title: "Liste des priorités",
          url: "#",
        },

      ],
    },
    {
      title: "Paramètres",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Gestion des utilisateurs",
          url: "#",
        },
        {
          title: "Gestion des catégories",
          url: "#",
        },
        {
          title: "Gestion des roles",
          url: "#",
        },
        {
          title: "Profil",
          url: "#",
        },

      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
  )
}
