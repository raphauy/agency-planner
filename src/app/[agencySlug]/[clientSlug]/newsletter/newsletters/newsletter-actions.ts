"use server"
  
import { revalidatePath } from "next/cache"
import { NewsletterDAO, NewsletterFormValues, createNewsletter, updateNewsletter, getNewsletterDAO, deleteNewsletter, updateContent, updateBanner, setFooter, setEmailFrom, setAudience, setReplyTo, sendTestEmail, setNameFrom, broadcastNewsletter, processPendingEmailsends, checkResendStatus } from "@/services/newsletter-services"


export async function getNewsletterDAOAction(id: string): Promise<NewsletterDAO | null> {
    return getNewsletterDAO(id)
}

export async function createOrUpdateNewsletterAction(id: string | null, data: NewsletterFormValues): Promise<NewsletterDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateNewsletter(id, data)
    } else {
        updated= await createNewsletter(data)
    }     

    revalidatePath("/newsletter/newsletters")

    return updated as NewsletterDAO
}

export async function deleteNewsletterAction(id: string): Promise<NewsletterDAO | null> {    
    const deleted= await deleteNewsletter(id)

    revalidatePath("/newsletter/newsletters")

    return deleted as NewsletterDAO
}

export async function updateContentAction(id: string, contentHtml: string, contentJson: string)  {
    const updated= await updateContent(id, contentHtml, contentJson)

    revalidatePath("/newsletter/newsletters")

    return updated
}

export async function updateBannerAction(id: string, banner: string) {
    const updated= await updateBanner(id, banner)

    revalidatePath("/newsletter/newsletters")

    return updated
}

export async function setFooterAction(newsletterId: string, footerText: string, footerLinkHref: string, footerLinkText: string) {
    const updated= await setFooter(newsletterId, footerText, footerLinkHref, footerLinkText)

    revalidatePath("/newsletter/newsletters")

    return updated
}

export async function setNameFromAction(newsletterId: string, nameFrom: string) {
    const updated= await setNameFrom(newsletterId, nameFrom)

    revalidatePath("/newsletter/newsletters")

    return updated
}

export async function setEmailFromAction(newsletterId: string, emailFrom: string) {
    const updated= await setEmailFrom(newsletterId, emailFrom)

    revalidatePath("/newsletter/newsletters")

    return updated
}

export async function setReplyToAction(newsletterId: string, replyTo: string) {
    const updated= await setReplyTo(newsletterId, replyTo)

    revalidatePath("/newsletter/newsletters")

    return updated
}

export async function setAudienceAction(newsletterId: string, audienceId: string) {
    const updated= await setAudience(newsletterId, audienceId)

    revalidatePath("/newsletter/newsletters")

    return updated
}

export async function sendTestEmailAction(newsletterId: string, emailTo: string): Promise<boolean> {    
  
    const res= await sendTestEmail(newsletterId, emailTo)
    revalidatePath("/newsletter/newsletters")
    return res
}

export async function broadcastNewsletterAction(newsletterId: string) {
    const res= await broadcastNewsletter(newsletterId)
    revalidatePath("/newsletter/newsletters")
    return res
}

export async function processPendingEmailsendsAction() {
    const res= await processPendingEmailsends()
    revalidatePath("/newsletter/newsletters")
    return res
}

export async function checkResendStatusAction() {
    const res= await checkResendStatus()
    revalidatePath("/newsletter/newsletters")
    return res
}