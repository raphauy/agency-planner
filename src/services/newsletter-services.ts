import * as z from "zod"
import { prisma } from "@/lib/db"
import { ClientDAO } from "./client-services"
import { NewsletterStatus } from "@prisma/client"
import { AudienceDAO } from "./audience-services"

export type NewsletterDAO = {
	id: string
	subject: string
	status: NewsletterStatus
	sentByName: string | undefined
	emailFrom: string | undefined
	replyTo: string | undefined
	contentHtml: string | undefined
	contentJson: string | undefined
	banner: string | undefined
	footerText: string | undefined
	footerLinkHref: string | undefined
	footerLinkText: string | undefined
	createdAt: Date
	updatedAt: Date
	startedAt: Date | undefined
	audience: AudienceDAO | null
	audienceId: string | undefined
	client: ClientDAO
	clientId: string
}

export const NewsletterSchema = z.object({
	subject: z.string().min(1, "subject is required."),
	clientId: z.string().min(1, "clientId is required."),
})

export type NewsletterFormValues = z.infer<typeof NewsletterSchema>


export async function getNewslettersDAO(clientId: string) {
  const found = await prisma.newsletter.findMany({
    where: {
      clientId
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      audience: true
    }
  })
  return found as NewsletterDAO[]
}

export async function getNewsletterDAO(id: string) {
  const found = await prisma.newsletter.findUnique({
    where: {
      id
    },
    include: {
      audience: true
    }
  })
  return found as NewsletterDAO
}


    
export async function createNewsletter(data: NewsletterFormValues) {
  // get last newsletter and use its banner and footer as default, if there is no newsletter, use the default values
  const lastNewsletter= await prisma.newsletter.findFirst({
    orderBy: {
      id: 'desc'
    }
  })
  const defaultBanner= lastNewsletter?.banner || "/newsletter_placeholder.svg"
  const defaultFooterText= lastNewsletter?.footerText || "¡Gracias por leer!👋 ¿Te veo en el próximo? Si no querés recibir estos emails podés darte de baja (ver link más abajo)— Tu empresa (@tuempresahandle)"
  const defaultFooterLinkHref= lastNewsletter?.footerLinkHref || "https://tinta.wine"
  const defaultFooterLinkText= lastNewsletter?.footerLinkText || "Conocé más sobre nosotros"
  const defaultEmailFrom= lastNewsletter?.emailFrom || null
  const defaultReplyTo= lastNewsletter?.replyTo || null
  const created = await prisma.newsletter.create({
    data: {
      ...data,
      banner: defaultBanner,
      footerText: defaultFooterText,
      footerLinkHref: defaultFooterLinkHref,
      footerLinkText: defaultFooterLinkText,
      emailFrom: defaultEmailFrom,
      replyTo: defaultReplyTo
    }
  })
  return created
}

export async function updateNewsletter(id: string, data: NewsletterFormValues) {
  const updated = await prisma.newsletter.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteNewsletter(id: string) {
  const deleted = await prisma.newsletter.delete({
    where: {
      id
    },
  })
  return deleted
}

export async function updateContent(id: string, textContent: string, jsonContent: string) {
  const updated = await prisma.newsletter.update({
    where: {
      id
    },
    data: {
      contentHtml: textContent,
      contentJson: jsonContent
    }
  })
  return updated
}

export async function updateBanner(id: string, banner: string) {
  const updated = await prisma.newsletter.update({
    where: {
      id
    },
    data: {
      banner
    }
  })
  return updated
}

export async function setFooter(newsletterId: string, footerText: string, footerLinkHref: string, footerLinkText: string) {
  const updated = await prisma.newsletter.update({
    where: {
      id: newsletterId
    },
    data: {
      footerText,
      footerLinkHref,
      footerLinkText
    }
  })
  return updated
}

export async function setEmailFrom(newsletterId: string, emailFrom: string) {
  const updated = await prisma.newsletter.update({
    where: {
      id: newsletterId
    },
    data: {
      emailFrom
    }
  })
  return updated
}

export async function setReplyTo(newsletterId: string, replyTo: string) {
  const updated = await prisma.newsletter.update({
    where: {
      id: newsletterId
    },
    data: {
      replyTo
    }
  })
  return updated
}

export async function setAudience(newsletterId: string, audienceId: string) {
  const updated = await prisma.newsletter.update({
    where: {
      id: newsletterId
    },
    data: {
      audienceId
    }
  })
  return updated
}