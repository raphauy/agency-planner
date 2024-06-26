import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { auth } from "./auth"
import { PublicationStatus, UserRole } from "@prisma/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getCurrentUser() {
  const session = await auth()

  return session?.user
}

export async function getCurrentAgencyId() {
  const session = await auth()

  return session?.user?.agencyId
}
export async function getCurrentAgencySlug() {
  const session = await auth()

  return session?.user?.agencySlug
}

export async function getCurrentRole() {
  const session = await auth()

  return session?.user?.role
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase() // Convertir a minúsculas
    .normalize('NFD') // Descomponer los acentos y diacríticos
    .replace(/[\u0300-\u036f]/g, '') // Eliminar los diacríticos
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/[^\w\-]+/g, '') // Eliminar todos los caracteres que no sean palabras o guiones
    .replace(/\-\-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .trim(); // Eliminar espacios al inicio y al final
}


export function getLabel(role: UserRole) {
  switch (role) {
    case "ADMIN":
      return "Admin"
    case "AGENCY_OWNER":
      return "Agencia (DA)"
    case "AGENCY_ADMIN":
      return "Agencia (AA)"
    case "AGENCY_CREATOR":
      return "Agencia (CC)"
    case "CLIENT_ADMIN":
      return "Cliente"
    case "CLIENT_USER":
      return "Cliente"
    case "GUEST":
      return "Invitado"
    default:
      return "Desconocido"
  }
}

export function getPostStatusColor(status: PublicationStatus, opacity?: string) {
  switch (status) {
    case PublicationStatus.BORRADOR:
      return `rgba(156, 163, 175, ${opacity || 1})`; // gray
    case PublicationStatus.REVISADO:
      return `rgba(255, 140, 0, ${opacity || 1})`; // orange
    case PublicationStatus.APROBADO:
      return `rgba(0, 128, 0, ${opacity || 1})`; // green
    case PublicationStatus.PROGRAMADO:
      return `rgba(51, 153, 255, ${opacity || 1})`; // sky
    case PublicationStatus.PUBLICADO:
      return `rgba(255, 215, 0, ${opacity || 1})`;
    default:
      return `rgba(156, 163, 175, ${opacity || 1})`; // gray
    }
}
