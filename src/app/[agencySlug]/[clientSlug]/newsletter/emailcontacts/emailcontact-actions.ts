"use server"
  
import { revalidatePath } from "next/cache"
import { EmailContactDAO, EmailContactFormValues, createEmailContact, updateEmailContact, getEmailContactDAO, deleteEmailContact } from "@/services/emailcontact-services"


export async function getEmailContactDAOAction(id: string): Promise<EmailContactDAO | null> {
    return getEmailContactDAO(id)
}

export async function createOrUpdateEmailContactAction(id: string | null, data: EmailContactFormValues): Promise<EmailContactDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateEmailContact(id, data)
    } else {
        updated= await createEmailContact(data)
    }     

    revalidatePath("/newsletter/emailContacts")

    return updated as EmailContactDAO
}

export async function deleteEmailContactAction(id: string): Promise<EmailContactDAO | null> {    
    const deleted= await deleteEmailContact(id)

    revalidatePath("/newsletter/emailContacts")

    return deleted as EmailContactDAO
}

