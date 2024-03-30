"use client"

import { useAdminRoles } from "@/app/admin/users/use-roles"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { UserRole } from "@prisma/client"
import { BriefcaseBusiness, LayoutDashboard, LockKeyhole, Receipt, User } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"


export default function MenuAgency() {
    
    const user= useSession().data?.user
    const userRole= user?.role
    const alowedRoles= useAdminRoles()

    const clientSlug= useParams().clientSlug
    
    const path= usePathname()
    const params= useParams()
    const agencySlug= params.agencySlug
    if (!agencySlug)
        return <div>Agency not found</div>

    if (clientSlug)
        return null

    const data= [
        {
            href: `/${agencySlug}`,
            icon: LayoutDashboard,
            text: "Dashboard"
        },
        {
            href: `/${agencySlug}/clients`,
            icon: BriefcaseBusiness,
            text: "Clientes"
        },
        {
            href: `/${agencySlug}/users`,
            icon: User,
            text: "Equipo"
        },
        {
            href: `/${agencySlug}/permissions`,
            icon: LockKeyhole,
            text: "Permisos",
            roles: alowedRoles
        },
        {
            href: `/${agencySlug}/billing`,
            icon: Receipt,
            text: "Billing"
        },
    ]
        
    return (
        <div className="flex items-center justify-between">
            <nav>
                <ul className="flex items-center">
                    {data.map((item, index) => {
                        if (item.roles && userRole && !item.roles.includes(userRole))
                            return null
                        return (
                            <li key={index} className={cn("border-b-primary", path === item.href && "border-b-2")}>
                                <Link href={item.href}>
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
            <p className="mr-4">{user?.name} - {userRole}</p>
        </div>
    )
}

