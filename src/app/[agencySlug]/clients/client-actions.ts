"use server"
  
import { ClientDAO, ClientFormValues, createClient, deleteClient, getClientDAO, getClientDAOBySlug, getClientsDAOByAgencyId, getClientsDAOByAgencySlug, getClientsOfCurrentUser, getFullClientDAO, updateClient } from "@/services/client-services"
import { revalidatePath } from "next/cache"

import { SelectorData } from "@/components/header/selectors/selectors"
import { generateSlug, getCurrentAgencyId, getCurrentAgencySlug, getCurrentUser } from "@/lib/utils"
import { getComplentaryUsers, setUsers } from "@/services/client-services"
import { getIgProfile } from "@/services/instagram-services"
import { uploadFileWithUrl } from "@/services/upload-file-service"
import { UserDAO } from "@/services/user-services"
import { BillableItemFormValues, createBillableItem } from "@/services/billableitem-services"
import { getBillingTypeDAOByName } from "@/services/billingtype-services"
import { redirect } from "next/navigation"
    

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

    revalidatePath("/[agencySlug]", "page")

    const agencySlug= deleted.agency.slug
    redirect(`/${agencySlug}`)
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
    const uploadRes= await uploadFileWithUrl(picUrl)
    const image= uploadRes?.url
    const bytes= uploadRes?.bytes
    console.log("Uploaded image, bytes:", bytes);
  
    const slug= generateSlug(igProfile.full_name)
    const data= {
        agencyId,
        name: igProfile.full_name,
        slug,
        image,
        igHandle,
        description: igProfile.biography,
        defaultHashtags: "#" + slug + " #agregar" + " #otros" + " #hashtags" + " #aquí"
    }

    const storageBillingType= await getBillingTypeDAOByName('Storage')
    if (!storageBillingType) {
        throw new Error('Billing type "Storage" not found')
    }
    const created= await createClient(data)
  
    if (image){
        const billableItemData: BillableItemFormValues= {
        description: 'File storage',
        quantity: bytes as number,
        unitPrice: 0.01,
        url: image,
        billingTypeId: storageBillingType.id,
        agencyId,
        clientId: created.id,
        }
        const billableCreated= await createBillableItem(billableItemData)
        console.log('billableCreated', billableCreated)  
    } else {
        console.log('no image to create billable item for client ' + created.name)
    }
    
    revalidatePath("/[agencySlug]", "page")

    const agencySlug= created.agency.slug
    redirect(`/${agencySlug}/${created.slug}/settings`)
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

export async function getClientDAOBySlugAction(slug: string): Promise<ClientDAO | null> {
    const client= await getClientDAOBySlug(slug)

    return client as ClientDAO
}