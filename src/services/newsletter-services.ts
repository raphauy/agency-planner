import Newsletter from "@/components/email/newsletter"
import { prisma } from "@/lib/db"
import { EmailSendStatus, NewsletterStatus } from "@prisma/client"
import { Resend } from "resend"
import * as z from "zod"
import { AudienceDAO } from "./audience-services"
import { ClientDAO } from "./client-services"
import { getEmailContactsDAO } from "./emailcontact-services"
import { createEmailSend, EmailSendFormValues, getNewsletterIdsWithPendingEmailsends, getPendingEmailSendsDAO, setResendId, setEmailSendStatus, getSentEmailSend, getPendingEmailSendsCount } from "./emailsend-services"

export type NewsletterDAO = {
	id: string
	subject: string
	status: NewsletterStatus
	sentByName: string | undefined
	nameFrom: string | undefined
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
    where: {
      clientId: data.clientId
    },
    orderBy: {
      id: 'desc'
    }
  })
  const defaultBanner= lastNewsletter?.banner || "https://agency-planner.com/newsletter_placeholder.svg"
  const defaultFooterText= lastNewsletter?.footerText || "¡Gracias por leer!👋 ¿Te veo en el próximo? Si no querés recibir estos emails podés darte de baja (ver link más abajo)\n\n— Tu empresa (@tuempresahandle)"
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
  const newsletter= await prisma.newsletter.findUnique({
    where: {
      id
    },
    select: {
      status: true
    }
  })
  if (newsletter?.status !== "DRAFT") {
    throw new Error("No se puede eliminar el newsletter porque ya no está en estado DRAFT.")
  }
  const deleted = await prisma.newsletter.delete({
    where: {
      id
    },
  })
  return deleted
}

export async function setNewsletterStatus(id: string, status: NewsletterStatus) {
  const updated = await prisma.newsletter.update({
    where: {
      id
    },
    data: {
      status
    }
  })
  return updated
}

export async function updateContent(id: string, contentHtml: string, contentJson: string) {
  const updated = await prisma.newsletter.update({
    where: {
      id
    },
    data: {
      contentHtml,
      contentJson
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

export async function setNameFrom(newsletterId: string, nameFrom: string) {
  const updated = await prisma.newsletter.update({
    where: {
      id: newsletterId
    },
    data: {
      nameFrom
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

export async function sendTestEmail(newsletterId: string, emailTo: string) {
  console.log("Sending test email to: ", emailTo);

  const newsletter= await getNewsletterDAO(newsletterId)
  if (!newsletter) {
    console.log("Error sending test email, newsletter not found.")    
    throw new Error("Error sending test email, newsletter not found.")
  }
  const nameFrom= newsletter.nameFrom
  const emailFrom= newsletter.emailFrom
  const replyTo= newsletter.replyTo
  const subject= newsletter.subject
  const content= newsletter.contentHtml
  const banner= newsletter.banner
  const footerText= newsletter.footerText
  const footerLinkHref= newsletter.footerLinkHref
  const footerLinkText= newsletter.footerLinkText

  if (!emailFrom || !subject || !content || !banner || !footerText || !footerLinkHref || !footerLinkText) { 
    console.log("Error sending test email, data validation failed.")    
    throw new Error("Error sending test email, data validation failed.")
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const mailId= "only-image"
  const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const linkUnsubscribe = `${BASE_URL}/api/newsletter/${newsletter.audienceId}/unsuscribe/${mailId}`

  const from= nameFrom ? `${nameFrom} <${emailFrom}>` : emailFrom

  const { data, error } = await resend.emails.send({
    from,
    to: [emailTo],
    reply_to: replyTo,
    subject: subject,
    react: Newsletter({ content, banner, footerText, footerLinkHref, footerLinkText, linkUnsubscribe }),
  });
 

  if (error) {
    console.log("Error sending test email")    
    console.log("error.name:", error.name)    
    console.log("error.message:", error.message)
    return false
  } else {
    console.log("email result: ", data)
  }

  return true
}

export async function broadcastNewsletter(newsletterId: string) {
  const newsletter= await getNewsletterDAO(newsletterId)
  if (!newsletter) {
    console.log("Error broadcasting newsletter, newsletter not found.")    
    throw new Error("Error broadcasting newsletter, newsletter not found.")
  }

  const emailFrom= newsletter.emailFrom
  const subject= newsletter.subject
  const content= newsletter.contentHtml
  const banner= newsletter.banner
  const footerText= newsletter.footerText
  const footerLinkHref= newsletter.footerLinkHref
  const footerLinkText= newsletter.footerLinkText

  if (!emailFrom || !subject || !content || !banner || !footerText || !footerLinkHref || !footerLinkText) { 
    console.log("Error sending test email, data validation failed.")    
    throw new Error("Error sending test email, data validation failed.")
  }

  const audience= newsletter.audience
  if (!audience) {
    console.log("Error broadcasting newsletter, audience not found.")    
    throw new Error("Error broadcasting newsletter, audience not found.")
  }

  const contacts= await getEmailContactsDAO(audience.id)
  if (!contacts || contacts.length === 0) {
    console.log("Error broadcasting newsletter, contacts not found.")    
    throw new Error("Error broadcasting newsletter, contacts not found.")
  }

  for (const contact of contacts) {
    try {
      
      const emailSendValues: EmailSendFormValues= {
        status: "PENDING",
        name: contact.name,
        to: contact.email,
        subject: subject,
        newsletterId: newsletterId
      }
      await createEmailSend(emailSendValues)
    } catch (error) {
      console.log("Error creating email send: ", error)
    }
  }

  await setNewsletterStatus(newsletterId, "PENDING")

  await processPendingEmailsends()
}

export async function getResendEmail(resendId: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const email= await resend.emails.get(resendId)
  return email
}

export async function processPendingEmailsendsOfNewsletter(newsletterId: string) {

  const MAX_EMAILS_TO_PROCESS= Number(process.env.MAX_EMAILS_TO_PROCESS) || 10

  const newsletter= await getNewsletterDAO(newsletterId)
  if (!newsletter) {
    console.log("Error broadcasting newsletter, newsletter not found.")    
    throw new Error("Error broadcasting newsletter, newsletter not found.")
  }

  const nameFrom= newsletter.nameFrom
  const emailFrom= newsletter.emailFrom
  const replyTo= newsletter.replyTo
  const subject= newsletter.subject
  const content= newsletter.contentHtml
  const banner= newsletter.banner
  const footerText= newsletter.footerText
  const footerLinkHref= newsletter.footerLinkHref
  const footerLinkText= newsletter.footerLinkText

  if (!emailFrom || !subject || !content || !banner || !footerText || !footerLinkHref || !footerLinkText) { 
    console.log("Error sending test email, data validation failed.")    
    throw new Error("Error sending test email, data validation failed.")
  }

  const audience= newsletter.audience
  if (!audience) {
    console.log("Error broadcasting newsletter, audience not found.")    
    throw new Error("Error broadcasting newsletter, audience not found.")
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const from= nameFrom ? `${nameFrom} <${emailFrom}>` : emailFrom

  const emailsends= await getPendingEmailSendsDAO(newsletterId, MAX_EMAILS_TO_PROCESS)
  for (const emailSend of emailsends) {
    try {
      const linkUnsubscribe = `${BASE_URL}/api/newsletter/${newsletter.audienceId}/unsuscribe/${emailSend.id}`
      const { data, error } = await resend.emails.send({
        from,
        to: [emailSend.to],
        reply_to: replyTo,
        subject: subject,
        react: Newsletter({ content, banner, footerText, footerLinkHref, footerLinkText, linkUnsubscribe }),
      });
      if (error) {
        console.log("Error sending email: ", error)
      } 
      if (data) {
        console.log("Email sent: ", data)
        await setResendId(emailSend.id, data.id)
        // sleep 1 second
        // await new Promise(resolve => setTimeout(resolve, 1000));
        // const resendEmail= await getResendEmail(data.id)
        // const resendStatus= resendEmail.data?.last_event
        // if (resendStatus) {
        //   console.log("Last event: ", resendStatus)
        //   await setEmailSendStatus(emailSend.id, resendStatus)
        // } else {
        //   console.log("No last event found")
        // }
      }
    } catch (error) {
      console.log("Error sending email: ", error)
    }
  }
}

export async function processPendingEmailsends() {
  const newsletterIds= await getNewsletterIdsWithPendingEmailsends()
  for (const newsletterId of newsletterIds) {
    await processPendingEmailsendsOfNewsletter(newsletterId)    
  }
  await checkPendingNewsletters()
}

export async function checkResendStatus() {
  const MAX_STATUS_TO_CHECK= 10
  const sentEmailSends= await getSentEmailSend(MAX_STATUS_TO_CHECK)
  for (const sentEmailSend of sentEmailSends) {
    if (!sentEmailSend.resendId) {
      console.log("Error checking resend status, resendId not found.")    
      continue
    }
    const resendEmail= await getResendEmail(sentEmailSend.resendId)
    const resendStatus= resendEmail.data?.last_event
    if (resendStatus) {
      await setEmailSendStatus(sentEmailSend.id, resendStatus)
    }
  }
  await checkPendingNewsletters()
}

export async function checkPendingNewsletters() {
  const pendingNewsletters= await prisma.newsletter.findMany({
    where: {
      status: "PENDING"
    }
  })
  for (const newsletter of pendingNewsletters) {
    const emailsPendingCount= await getPendingEmailSendsCount(newsletter.id)
    if (emailsPendingCount === 0) {
      console.log("Setting newsletter status to SENT: ", newsletter.subject)
      await setNewsletterStatus(newsletter.id, "SENT")
    }
  }
}
