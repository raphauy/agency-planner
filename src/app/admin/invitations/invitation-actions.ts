"use server"
  
import { revalidatePath } from "next/cache"
import { InvitationDAO, InvitationFormValues, createInvitation, updateInvitation, getFullInvitationDAO, deleteInvitation } from "@/services/invitation-services"


export async function getInvitationDAOAction(id: string): Promise<InvitationDAO | null> {
    return getFullInvitationDAO(id)
}

export async function createOrUpdateInvitationAction(id: string | null, data: InvitationFormValues): Promise<InvitationDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateInvitation(id, data)
    } else {
        updated= await createInvitation(data)
    }     

    revalidatePath("/admin/invitations")

    return updated as InvitationDAO
}

export async function deleteInvitationAction(id: string): Promise<InvitationDAO | null> {    
    const deleted= await deleteInvitation(id)

    revalidatePath("/admin/invitations")

    return deleted as InvitationDAO
}

