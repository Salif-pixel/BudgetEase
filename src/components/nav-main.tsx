"use client"

import { ChevronRight } from "lucide-react"
import { useState } from "react" // Importez useState pour gérer l'état actif

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/src/components/ui/sidebar"
import Link from "next/link";

export function NavMain({
                          items,
                        }: {
  items: {
    title: string
    url: string
    icon: string
    isActive?: boolean
    items?: {
      title: string
      url: string
      icon: string
      isActive?: boolean
    }[]
  }[]
}) {
  // État pour suivre l'élément actif
  const [activeItem, setActiveItem] = useState<string | null>(null)

  // Fonction pour gérer le clic sur un élément
  const handleItemClick = (title: string) => {
    setActiveItem(title === activeItem ? null : title) // Basculer l'état actif
  }

  return (
      <SidebarGroup>
        <SidebarGroupLabel>Sections</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
              <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                      className={"text-foreground"}
                      asChild
                      isActive={false} // Définir l'état actif
                      tooltip={item.title}
                  >
                    <div>
                      {item.icon}
                      <span className={"font-bold"}>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRight />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                      asChild
                                      isActive={subItem.isActive} // Définir l'état actif pour les sous-éléments
                                      onClick={() => handleItemClick(subItem.title)} // Gérer le clic
                                  >
                                    <Link prefetch={true} href={subItem.url}>
                                      {subItem.icon}
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
  )
}