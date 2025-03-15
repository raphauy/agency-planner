import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { auth } from "./auth"
import { PublicationStatus, PublicationType, UserRole } from "@prisma/client"
import { format as formatTZ, fromZonedTime, toZonedTime } from "date-fns-tz";
import { es } from "date-fns/locale";
import { format, isThisWeek, isToday, isYesterday, parseISO } from "date-fns";

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

export function getFormat(date: Date): string {
  const timeZone = "America/Montevideo";
  
  // Convert the date to the desired time zone
  const zonedDate = toZonedTime(date, timeZone);
  
  const today = toZonedTime(new Date(), timeZone);

  if (
    zonedDate.getDate() === today.getDate() &&
    zonedDate.getMonth() === today.getMonth() &&
    zonedDate.getFullYear() === today.getFullYear()
  ) {
    return formatTZ(zonedDate, "HH:mm", { timeZone, locale: es });
  } else {
    return formatTZ(zonedDate, "yyyy/MM/dd", { timeZone, locale: es });
  }
}

export function formatWhatsAppStyle(date: Date | string): string {
  let parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const timeZone = "America/Montevideo";
  const zonedDate = toZonedTime(parsedDate, timeZone);

  if (isToday(zonedDate)) {
    return formatTZ(zonedDate, 'HH:mm', { timeZone });
  } else if (isYesterday(zonedDate)) {
    return 'Ayer';
  } else if (isThisWeek(zonedDate)) {
    return formatTZ(zonedDate, 'eeee', { timeZone, locale: es });
  } else {
    return formatTZ(zonedDate, 'dd/MM/yyyy', { timeZone });
  }
}

export const colorPalette = [
  'rgb(80, 80, 80)',
  'rgb(75, 75, 75)',
  'rgb(70, 70, 70)',
  'rgb(65, 65, 65)',
  'rgb(60, 60, 60)',
  'rgb(55, 55, 55)',
  'rgb(50, 50, 50)',
  'rgb(45, 45, 45)',
  'rgb(40, 40, 40)',
  'rgb(35, 35, 35)',
  'rgb(30, 30, 30)',
  'rgb(25, 25, 25)',
  'rgb(20, 20, 20)',
  'rgb(18, 18, 18)',
  'rgb(16, 16, 16)',
  'rgb(14, 14, 14)',
  'rgb(12, 12, 12)',
  'rgb(10, 10, 10)',
  'rgb(8, 8, 8)',
  'rgb(5, 5, 5)',
];

export function getPublicationPath(type: PublicationType) {
  switch (type) {
    case PublicationType.INSTAGRAM_POST:
      return "instagram/posts"
    case PublicationType.INSTAGRAM_REEL:
      return "instagram/reels"
    case PublicationType.INSTAGRAM_STORY:
      return "instagram/historias"
    default:
      return "instagram/feed"
  }
}


export function getFormatInTimezone(date: Date, timeZone: string) {
  
  // Convert the date to the desired time zone
  const zonedDate = toZonedTime(date, timeZone);
  
  const today = toZonedTime(new Date(), timeZone);

  if (
    zonedDate.getDate() === today.getDate() &&
    zonedDate.getMonth() === today.getMonth() &&
    zonedDate.getFullYear() === today.getFullYear()
  ) {
    return formatTZ(zonedDate, "HH:mm", { timeZone, locale: es });
  } else {
    return formatTZ(zonedDate, "yyyy/MM/dd", { timeZone, locale: es });
  }
}

export function getRoleColor(role: string) {
  if (role === "assistant") return "bg-green-500"
  if (role === "system") return "bg-orange-500"
  if (role === "function") return "bg-blue-500"
  return "bg-black"
}

export function getStatusColorAndLabel(status: string) {
  if (status === 'open') {
    return "Conectado"
  } else if (status === 'close') {
    return "Desconectado"
  } else if (status === 'connecting') {
    return "Conectando"
  } else {
    return "Desconocido"
  }
}

export function checkValidPhone(phone: string) {
  const expReg = /^(\+)?[1-9]{1,3}[0-9]{7,13}$/
  return expReg.test(phone)
}

// función que transforma camel case en texto normal con mayúsculas
// ej nombreCompleto -> Nombre Completo 
// función que transforma camel case en texto normal con mayúsculas
// ej nombreCompleto -> Nombre Completo 
export function camelCaseToNormal(str: string): string {
  return str
      .replace(/([A-Z])/g, ' $1')  // Inserta un espacio antes de cada mayúscula
      .replace(/^./, function(str){ return str.toUpperCase(); })  // Capitaliza la primera letra
      .trim();  // Elimina cualquier espacio inicial innecesario
}

export function putTildes(str: string): string {
  switch (str) {
      case "Operacion":
          return "Operación"
      case "Resumen Conversacion":
          return "Resumen Conversación"
      default:
          return str
  }
}

export function getDatesFromSearchParams(searchParams: { from: string, to: string, last: string }) {
  let from= null
  let to= null
  const last= searchParams.last
  const today= new Date()
  if (last === "HOY") {
      from= new Date(today.getFullYear(), today.getMonth(), today.getDate())
      to= new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  } else if (last === "7D") {
      from= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7)
      to= new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  } else if (last === "30D") {
      from= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 30)
      to= new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  } else if (last === "LAST_MONTH") {
      from= new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
      console.log("from: ", from)
      // the day should be the last day of the previous month
      const firstDayOfCurrentMonth= new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      // substract one day to get the last day of the previous month
      const lastDayOfPreviousMonth= new Date(firstDayOfCurrentMonth.getTime() - 24 * 60 * 60 * 1000)
      to= new Date(new Date().getFullYear(), new Date().getMonth() - 1, lastDayOfPreviousMonth.getDate())
      console.log("to: ", to)
  } else if (last === "ALL") {
      from= null
      to= null
  } else {
      from= searchParams.from ? new Date(searchParams.from) : null
      to= searchParams.to ? new Date(searchParams.to) : null
  }

  from= from ? fromZonedTime(from, "America/Montevideo") : null
  to= to ? fromZonedTime(to, "America/Montevideo") : null

  return { from, to }
}

