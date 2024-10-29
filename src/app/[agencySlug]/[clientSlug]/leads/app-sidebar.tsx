"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { BookOpen, Bot, ChevronRightSquare, LayoutDashboard, MessageCircle, MessagesSquare, Phone } from "lucide-react";
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
  {
    title: "Conversaciones",
    url: `leads/conversaciones`,
    icon: MessageCircle,
    group: "conversaciones",
  },
  {
    title: "Chatwoot",
    url: `leads/chatwoot`,
    icon: MessagesSquare,
    group: "admin",
  },
  {
    title: "Whatsapp",
    url: `leads/whatsapp`,
    icon: MessageCircle,
    group: "admin",
  },
  {
    title: "Ignorados",
    url: `leads/ignorados`,
    icon: Phone,
    group: "admin",
  },
]

export function AppSidebar() {

    const path = usePathname()

    const [agencySlug, setAgencySlug] = useState("")
    const [clientSlug, setClientSlug] = useState("")
    const [finalPath, setFinalPath] = useState("")
    const { setOpen } = useSidebar()

    useEffect(() => {
        const { agencySlug, clientSlug, channelPath } = parsePath(path)
        setAgencySlug(agencySlug)
        setClientSlug(clientSlug)
        setFinalPath(channelPath)
        if (channelPath === "leads/conversaciones") {
            setOpen(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <SidebarGroup>
                  <SidebarGroupLabel>Admin</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                        {items.filter((item) => item.group === "admin").map((item) => (
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
                <div></div>
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