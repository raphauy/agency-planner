"use client"

import { UserRole } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useParams, usePathname } from "next/navigation"

export function useRoles() {
  const params= useParams()
  const path= usePathname()
  
  const agencySlug= params.agencySlug

  const currentRole= useSession().data?.user.role

  if (path === "/admin/users" || currentRole === "ADMIN") {
    return Object.values(UserRole)
  }

  if (agencySlug) {
    if (currentRole === "AGENCY_OWNER")
      return ["AGENCY_OWNER", "AGENCY_ADMIN", "AGENCY_CREATOR"]

    if (currentRole === "AGENCY_ADMIN") 
      return ["AGENCY_ADMIN", "AGENCY_CREATOR"]
  } 

  return []
}

export function useAgencySlug() {
  const params= useParams()
  return params.agencySlug
}

export function useMenuAdminRoles(): UserRole[] {
  return [UserRole.ADMIN, UserRole.AGENCY_OWNER, UserRole.AGENCY_ADMIN]
}

export function useMenuClientRoles(): UserRole[] {
  return [UserRole.ADMIN, UserRole.AGENCY_OWNER, UserRole.AGENCY_ADMIN, UserRole.AGENCY_CREATOR, UserRole.CLIENT_ADMIN, UserRole.CLIENT_USER]
}