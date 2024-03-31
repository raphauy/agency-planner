"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ListChecks, Megaphone, Receipt, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const data= [
    {
      href: `/admin`,
      icon: LayoutDashboard,
      text: "Dashboard"
    },
    {
        href: `/admin/agencies`,
        icon: Megaphone,
        text: "Agencies"
    },
    {
      href: `/admin/users`,
      icon: User,
      text: "Users"
    },
    {
        href: `/admin/channels`,
        icon: ListChecks,
        text: "Canales"
    },
    {
        href: `/admin/billableitems`,
        icon: Receipt,
        text: "Billing"
    },
  ]

export default function MenuAdmin() {
    const path= usePathname()
    if (!path.startsWith("/admin"))
        return <div>Path is not /admin</div>
    
    return (
        <nav>
            <ul className="flex items-center">
                {data.map((item, index) => {
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
    )
}

