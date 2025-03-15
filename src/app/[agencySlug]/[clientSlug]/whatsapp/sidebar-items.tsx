"use client"

import { BookOpen, Bot, BriefcaseBusiness, Database, DatabaseZap, Kanban, LayoutDashboard, MessageCircle, QrCodeIcon, Settings, SquareChevronRight, User, Users } from "lucide-react";

// Menu items.
export const whatsappItems = [
    {
        title: "Dashboard",
        url: `whatsapp`,
        icon: LayoutDashboard,
        group: "whatsapp",
    },
    {
        title: "CRM Kanban",
        url: `whatsapp/kanban`,
        icon: Kanban,
        group: "whatsapp",
    },
    {
        title: "Conversaciones",
        url: `whatsapp/conversaciones`,
        icon: MessageCircle,
        group: "whatsapp",
    },
    {
        title: "Registros",
        url: `whatsapp/registros`,
        icon: DatabaseZap,
        group: "whatsapp",
    },
    {
        title: "Documentos",
        url: `whatsapp/documentos`,
        icon: BookOpen,
        group: "herramientas",
    },
    {
        title: "Repositorios",
        url: `whatsapp/repositories`,
        icon: Database,
        group: "herramientas",
    },
    {
        title: "Prompt",
        url: `whatsapp/prompt`,
        icon: SquareChevronRight,
        group: "herramientas",
    },
    {
        title: "Simulador",
        url: `whatsapp/simulador`,
        icon: Bot,
        group: "herramientas",
    },
    {
        title: "Contactos",
        url: `whatsapp/contactos`,
        icon: User,
        group: "contactos",
    },
    {
        title: "Importación",
        url: `whatsapp/importacion`,
        icon: Users,
        group: "contactos",
    },
    {
        title: "Comerciales",
        url: `whatsapp/comerciales`,
        icon: BriefcaseBusiness,
        group: "contactos",
    },
    {
        title: "Conector QR",
        url: `whatsapp/connection`,
        icon: QrCodeIcon,
        group: "settings",
    }
]
