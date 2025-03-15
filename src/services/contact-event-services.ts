import * as z from "zod"
import { prisma } from "@/lib/db"
import { ContactDAO } from "./contact-services"
import { ContactEventType } from "@prisma/client"

export type ContactEventDAO = {
	id: string
	type: ContactEventType
	info: string | undefined
	by: string | undefined
	contact: ContactDAO
	contactId: string
	createdAt: Date
}

export async function getContactEventsDAO(contactId: string) {
  const found = await prisma.contactEvent.findMany({
    where: {
      contactId
    },
    orderBy: {
      createdAt: 'desc'
    },
  })
  return found as ContactEventDAO[]
}

export async function getContactEventDAO(id: string) {
  const found = await prisma.contactEvent.findUnique({
    where: {
      id
    },
  })
  return found as ContactEventDAO
}
    
export async function createContactEvent(type: ContactEventType, info: string | undefined, by: string | undefined, contactId: string) {
  const created = await prisma.contactEvent.create({
    data: {
      type,
      info,
      by,
      contactId
    }
  })
  return created
}

export async function deleteContactEvent(id: string) {
  const deleted = await prisma.contactEvent.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullContactEventsDAO() {
  const found = await prisma.contactEvent.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			contact: true,
		}
  })
  return found as ContactEventDAO[]
}
  
export async function getFullContactEventDAO(id: string) {
  const found = await prisma.contactEvent.findUnique({
    where: {
      id
    },
    include: {
			contact: true,
		}
  })
  return found as ContactEventDAO
}
    