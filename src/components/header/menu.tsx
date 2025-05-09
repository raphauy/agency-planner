"use client"

import { UserRole } from ".prisma/client"
import { useSession } from "next-auth/react"
import { useParams, usePathname } from "next/navigation"
import MenuAdmin from "./menu-admin"
import MenuAgency from "./menu-agency"
import MenuClient from "./menu-client"
import MenuInstagram from "./menu-instagram"
import MenuLeads from "./menu-leads"
import MenuNewsletter from "./menu-newsletter"
import MenuWhatsapp from "./menu-whatsapp"

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
    } else if (channel === "leads") {
        menu= <MenuLeads />
    } else if (channel === "newsletter") {
        menu= <MenuNewsletter />
    } else if (channel === "whatsapp") {
        menu= <MenuWhatsapp />
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