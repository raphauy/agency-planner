"use client"

import { useMenuAdminRoles } from "@/app/admin/users/use-roles"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { UserRole } from ".prisma/client"
import { BarChartBig, CalendarCheck2, LayoutDashboard, LockKeyhole, Receipt, User } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export default function MenuAgency() {

    const [userRole, setUserRole]= useState<UserRole>()

    const alowedRoles= useMenuAdminRoles()
    const clientSlug= useParams().clientSlug
    
    const session= useSession()
    const path= usePathname()

    useEffect(() => {    
        const user= session?.data?.user
        if (!user)
            return
        
        setUserRole(user.role)
    }, [session])
    

    const params= useParams()
    const agencySlug= params.agencySlug
    if (!agencySlug)
        return <div>Agency not found</div>

    if (clientSlug)
        return <div>borrar</div>
    

    const data= [
        {
            href: `/${agencySlug}`,
            icon: LayoutDashboard,
            text: "Dashboard",
            roles: alowedRoles
        },
        {
            href: `/${agencySlug}/users`,
            icon: User,
            text: "Equipo Agencia",
            roles: alowedRoles
        },
        {
            href: `/${agencySlug}/permissions`,
            icon: LockKeyhole,
            text: "Permisos",
            roles: alowedRoles.filter((role) => role !== "AGENCY_CREATOR")
        },
        {
            href: `/${agencySlug}/credits`,
            icon: BarChartBig,
            text: "Créditos",
            roles: alowedRoles.filter((role) => role !== "AGENCY_CREATOR")
        },
        {
            href: `/${agencySlug}/subscriptions`,
            icon: CalendarCheck2,
            text: "Suscripciones",
            roles: alowedRoles.filter((role) => role !== "AGENCY_CREATOR")
        },
    ]


    if (!userRole)
        return null
        
    return (
        <nav>
            <ul className="flex items-center">
                {data.map((item, index) => {
                    if (item.roles && userRole && !item.roles.includes(userRole))
                        return null
                    return (
                        <li key={index} className={cn("border-b-primary", path === item.href && "border-b-2")}>
                            <Link href={item.href} prefetch={false}>
                                <Button variant="ghost">
                                    <item.icon className="w-4 h-4 mr-1 mb-0.5" />
                                    {item.text}
                                </Button>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}

