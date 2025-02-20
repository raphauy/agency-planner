"use server"
  
import { revalidatePath } from "next/cache"
import { EmailSendDAO, EmailSendFormValues, createEmailSend, updateEmailSend, getEmailSendDAO, deleteEmailSend } from "@/services/emailsend-services"


export async function getEmailSendDAOAction(id: string): Promise<EmailSendDAO | null> {
    return getEmailSendDAO(id)
}

export async function createOrUpdateEmailSendAction(id: string | null, data: EmailSendFormValues): Promise<EmailSendDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateEmailSend(id, data)
    } else {
        updated= await createEmailSend(data)
    }     

    revalidatePath("/newsletter/emailSends")

    return updated as EmailSendDAO
}

export async function deleteEmailSendAction(id: string): Promise<EmailSendDAO | null> {    
    const deleted= await deleteEmailSend(id)

    revalidatePath("/newsletter/emailSends")

    return deleted as EmailSendDAO
}

