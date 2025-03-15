"use client"

import { CodeXml, Globe, LayoutDashboard, Newspaper, Users } from "lucide-react";

// Menu items.
export const newsletterItems = [
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
