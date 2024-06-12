"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import MenuAdmin from "./menu-admin"
import MenuAgency from "./menu-agency"
import MenuClient from "./menu-client"
import MenuInstagram from "./menu-instagram"
import { cn } from "@/lib/utils"
import { UserRole } from "@prisma/client"

export default function Menu() {

    const user= useSession().data?.user

    const params= useParams()    
    const path= usePathname()

    const clientSlug= params.clientSlug
    const agencySlug= params.agencySlug

    const channel= path.split("/")[3]

    let menu
    if (path.startsWith("/admin") && user?.role === "ADMIN") {
        menu= <MenuAdmin />
    } else if (channel === "instagram") {
        menu= <MenuInstagram />
    } else if (clientSlug) {
        menu= <MenuClient />
    } else if (agencySlug) {
        menu= <MenuAgency />
    } else {
        menu= null    
    }



    return (
        <div className="flex justify-between">
            {menu}
            {user && <p className="mr-4">{user?.name} {user?.role.startsWith("CLIENT") ? "" : " - " + getLabel(user?.role)}</p>}
        </div>
    )
}

function getLabel(role: UserRole) {
    switch (role) {
        case 'ADMIN':
            return 'Super Admin'
        case 'AGENCY_OWNER':
            return 'DA'
        case 'AGENCY_ADMIN':
            return 'Admin'
        case 'AGENCY_CREATOR':
            return 'Creador'
        default:
            return 'Invitado'
    }
}