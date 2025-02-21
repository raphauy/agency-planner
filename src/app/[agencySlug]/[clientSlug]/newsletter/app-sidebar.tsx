"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { BookOpen, Bot, ChevronRightSquare, CodeXml, FileStack, Globe, LayoutDashboard, MessageCircle, MessagesSquare, Newspaper, Phone, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: `newsletter`,
        icon: LayoutDashboard,
        group: "newsletter",
    },
    {
        title: "Newsletters",
        url: `newsletter/newsletters`,
        icon: Newspaper,
        group: "newsletter",
    },
    {
        title: "Audiencias",
        url: `newsletter/audiences`,
        icon: Users,
        group: "newsletter",
    },
    {
        title: "Histórico",
        url: `newsletter/history`,
        icon: FileStack,
        group: "newsletter",
    },
    {
        title: "Widgets",
        url: `newsletter/widgets`,
        icon: CodeXml,
        group: "settings",
    },
    {
        title: "Dominios",
        url: `newsletter/domains`,
        icon: Globe,
        group: "settings",
    }
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
        <div>
            <Sidebar className="pt-[90px] z-0 h-full" collapsible="icon">
                <SidebarContent>
                    <SidebarGroup>
                        <div className="flex items-center justify-between">
                            <SidebarGroupLabel>Newsletter</SidebarGroupLabel>
                            <SidebarTrigger />
                        </div>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.filter((item) => item.group === "newsletter").map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={finalPath === item.url}>
                                            <Link href={`/${agencySlug}/${clientSlug}/${item.url}`} prefetch={false}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Settings</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.filter((item) => item.group === "settings").map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={finalPath === item.url}>
                                            <Link href={`/${agencySlug}/${clientSlug}/${item.url}`} prefetch={false}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
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
        </div>
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