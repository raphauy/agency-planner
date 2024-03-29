"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import MenuAdmin from "./menu-admin"
import MenuAgency from "./menu-agency"
import MenuClient from "./menu-client"

export default function Menu() {

    const params= useParams()    
    const path= usePathname()

    if (path.startsWith("/admin")) {
        return <MenuAdmin />
    }

    const clientSlug= params.clientSlug
    if (clientSlug) {
        return <MenuClient />
    }

    const agencySlug= params.agencySlug
    if (agencySlug) {
        return <MenuAgency />
    }



    return <div></div>
}
