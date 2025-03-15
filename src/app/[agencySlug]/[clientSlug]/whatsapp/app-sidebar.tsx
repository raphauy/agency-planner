"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { CodeXml, Globe, LayoutDashboard, Newspaper, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";


type Props= {
    items: {
        title: string
        url: string
        icon: React.ElementType
        group: string
    }[]
}
export function AppSidebar({ items }: Props) {

    const path = usePathname()

    const [agencySlug, setAgencySlug] = useState("")
    const [clientSlug, setClientSlug] = useState("")
    const [finalPath, setFinalPath] = useState("")
    const { open }= useSidebar()

    useEffect(() => {
        const { agencySlug, clientSlug, channelPath } = parsePath(path)
        setAgencySlug(agencySlug)
        setClientSlug(clientSlug)
        setFinalPath(channelPath)
    }, [path])

  
    return (
        <div>
            <Sidebar className="pt-[90px] z-0 h-full" collapsible="icon">
            { !open && <SidebarTrigger className="h-5 w-5 ml-3"/>}
            <SidebarContent>
                {/* Agrupar los items por su propiedad 'group' */}
                {Array.from(new Set(items.map(item => item.group))).map((group, index) => (
                    <SidebarGroup key={group}>
                        <div className="flex items-center justify-between">
                            <SidebarGroupLabel>{group.charAt(0).toUpperCase() + group.slice(1)}</SidebarGroupLabel>
                            {index === 0 && <SidebarTrigger />}
                        </div>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.filter((item) => item.group === group).map((item) => (
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
                ))}
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Agency Planner</span>
                </div>
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