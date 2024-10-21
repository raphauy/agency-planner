"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { BookOpen, Bot, ChevronRightSquare, LayoutDashboard, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: `leads`,
    icon: LayoutDashboard,
    group: "leads",
  },
  {
    title: "Documentos",
    url: `leads/documentos`,
    icon: BookOpen,
    group: "leads",
  },
  {
    title: "Conversaciones",
    url: `leads/conversaciones`,
    icon: MessageCircle,
    group: "conversaciones",
  },
  {
    title: "Prompt",
    url: `leads/prompt`,
    icon: ChevronRightSquare,
    group: "conversaciones",
  },
  {
    title: "Simulador",
    url: `leads/simulador`,
    icon: Bot,
    group: "conversaciones",
  },
]

export function AppSidebar() {

    const path = usePathname()

    const [agencySlug, setAgencySlug] = useState("")
    const [clientSlug, setClientSlug] = useState("")
    const [finalPath, setFinalPath] = useState("")

    useEffect(() => {
        const { agencySlug, clientSlug, channelPath } = parsePath(path)
        setAgencySlug(agencySlug)
        setClientSlug(clientSlug)
        setFinalPath(channelPath)
    }, [path])
  
    return (
        <Sidebar className="pt-[90px] z-0 h-full" collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Leads</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.filter((item) => item.group === "leads").map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={finalPath === item.url}>
                                        <a href={`/${agencySlug}/${clientSlug}/${item.url}`}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Conversaciones</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.filter((item) => item.group === "conversaciones").map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={finalPath === item.url}>
                                        <a href={`/${agencySlug}/${clientSlug}/${item.url}`}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div>hola</div>
            </SidebarFooter>
        </Sidebar>
    )
}


function parsePath(referer: string) {
    // referer:  /raphael/gabi-zimmer/leads
    const path = referer.split('/').filter(Boolean)
    return {
        agencySlug: path[0],
        clientSlug: path[1],
        channelPath: path.slice(2).join('/'),
    }
}