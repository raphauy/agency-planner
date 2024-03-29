"use server"
  
import { ClientDAO, ClientFormValues, createClient, deleteClient, getClientsDAOByAgencyId, getClientsDAOByAgencySlug, getClientsOfCurrentUser, getFullClientDAO, updateClient } from "@/services/client-services"
import { revalidatePath } from "next/cache"

import { SelectorData } from "@/components/header/selectors/selectors"
import { generateSlug, getCurrentAgencyId, getCurrentAgencySlug, getCurrentUser } from "@/lib/utils"
import { getComplentaryUsers, setUsers } from "@/services/client-services"
import { getIgProfile } from "@/services/instagram-services"
import { uploadFileWithUrl } from "@/services/upload-file-service"
import { UserDAO } from "@/services/user-services"
    

export async function getClientDAOAction(id: string): Promise<ClientDAO | null> {
    return getFullClientDAO(id)
}

export async function createOrUpdateClientAction(id: string | null, data: ClientFormValues): Promise<ClientDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateClient(id, data)
    } else {
        updated= await createClient(data)
    }     

    const agencySlug= await getCurrentAgencySlug()
    revalidatePath(`/${agencySlug}`)

    return updated as ClientDAO
}

export async function deleteClientAction(id: string): Promise<ClientDAO | null> {    
    const deleted= await deleteClient(id)

    const agencySlug= await getCurrentAgencySlug()
    revalidatePath(`/${agencySlug}`)

    return deleted as ClientDAO
}
    
export async function getComplentaryUsersAction(id: string): Promise<UserDAO[]> {
    const complementary= await getComplentaryUsers(id)

    return complementary as UserDAO[]
}

export async function setUsersAction(id: string, users: UserDAO[]): Promise<boolean> {
    const res= setUsers(id, users)

    revalidatePath("/admin/clients")

    return res
}



export async function createClientWithIgHandleAction(agencyId: string, igHandle: string): Promise<ClientDAO | null> {
    const igProfile= await getIgProfile(igHandle)
    if (!igProfile?.profile_pic_url) {
      throw new Error("Instagram profile not found")
    }
    console.log(igProfile);
    

    const picUrl= igProfile.profile_pic_url
    const image= await uploadFileWithUrl(picUrl)
    if (!image) {
      throw new Error("No se pudo encontrar el perfil de Instagram")
    }
  
    const slug= generateSlug(igProfile.full_name)
    const data= {
        agencyId,
        name: igProfile.full_name,
        slug,
        image,
        igHandle,
        description: igProfile.biography,
    }

    const created= await createClient(data)
  
    const agencySlug= await getCurrentAgencySlug()
    revalidatePath(`/${agencySlug}`)

    return created as ClientDAO
}

export async function getClientSelectorsOfCurrentUserAction(agencySlug: string): Promise<SelectorData[]> {
    let clients

    const currentUser= await getCurrentUser()
    if (currentUser && currentUser.role === 'ADMIN') {
        clients= getClientsDAOByAgencySlug(agencySlug)
    } else {
        clients= await getClientsOfCurrentUser()
    }   
    
    revalidatePath(`/${agencySlug}`)

    return clients as SelectorData[]
}

export async function getClientsDAOByAgencyIdAction(agencyId: string): Promise<ClientDAO[]> {
    const clients= await getClientsDAOByAgencyId(agencyId)

    const agencySlug= await getCurrentAgencySlug()
    revalidatePath(`/${agencySlug}`)

    return clients as ClientDAO[]
}

export async function getClientsDAOByAgencySlugAction(agencySlug: string): Promise<ClientDAO[]> {
    const clients= await getClientsDAOByAgencySlug(agencySlug)

    revalidatePath(`/${agencySlug}`)

    return clients as ClientDAO[]
}