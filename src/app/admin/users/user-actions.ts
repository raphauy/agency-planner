"use server"
  
import { revalidatePath } from "next/cache"
import { UserDAO, UserFormValues, createUser, updateUser, getFullUserDAO, deleteUser, getUsersOfAgency, inviteClientUser, inviteAgencyUser } from "@/services/user-services"


export async function getUserDAOAction(id: string): Promise<UserDAO | null> {
    return getFullUserDAO(id)
}

export async function getUsersOfAgencyAction(agencyId: string): Promise<UserDAO[]> {
    const res= await getUsersOfAgency(agencyId)

    revalidatePath("/admin/users")

    return res
}

export async function createOrUpdateUserAction(id: string | null, data: UserFormValues): Promise<UserDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateUser(id, data)
    } else {
        updated= await createUser(data)
    }     

    revalidatePath("/admin/users")

    return updated as UserDAO
}

export async function deleteUserAction(id: string): Promise<UserDAO | null> {    
    const deleted= await deleteUser(id)

    revalidatePath("/admin/users")

    return deleted as UserDAO
}

export async function inviteClientUserAction(data: UserFormValues, clientId: string) {
    const res= await inviteClientUser(data, clientId)

    revalidatePath("[agencySlug]/[clientSlug]", "page")

    return res
}

export async function inviteAgencyUserAction(data: UserFormValues, agencyId: string) {
    const res= await inviteAgencyUser(data, agencyId)

    revalidatePath("[agencySlug]", "page")

    return res
}