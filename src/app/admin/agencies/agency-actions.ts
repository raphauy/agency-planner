"use server"
  
import { revalidatePath } from "next/cache"
import { AgencyDAO, AgencyFormValues, createAgency, updateAgency, getFullAgencyDAO, deleteAgency, setOwner } from "@/services/agency-services"
import { getIgProfile } from "@/services/instagram-services"
import { generateSlug } from "@/lib/utils"
import { uploadFileWithUrl } from "@/services/upload-file-service"


export async function getAgencyDAOAction(id: string): Promise<AgencyDAO | null> {
    return getFullAgencyDAO(id)
}

export async function createOrUpdateAgencyAction(id: string | null, data: AgencyFormValues): Promise<AgencyDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateAgency(id, data)
    } else {
        updated= await createAgency(data)
    }     

    revalidatePath("/admin/agencys")

    return updated as AgencyDAO
}

export async function createAgencyWithIgHandleAction(igHandle: string): Promise<AgencyDAO | null> {    
    const igProfile= await getIgProfile(igHandle)
    if (!igProfile) {
      throw new Error("No se pudo encontrar el perfil de Instagram")
    }

    const picUrl= igProfile.profile_pic_url
    const uploadRes= await uploadFileWithUrl(picUrl)
    const image= uploadRes?.url
    const bytes= uploadRes?.bytes
    console.log("Uploaded image, bytes:", bytes);
  
    const slug= generateSlug(igProfile.full_name)
    const data= {
      name: igProfile.full_name,
      slug,
      image,
      igHandle,
      description: igProfile.biography,
    }

    const created= await createAgency(data)
  
    revalidatePath("/admin/agencies")

    return created as AgencyDAO
}

export async function deleteAgencyAction(id: string): Promise<AgencyDAO | null> {    
    const deleted= await deleteAgency(id)

    revalidatePath("/admin/agencies")

    return deleted as AgencyDAO
}

export async function setOwnerAction(agencyId: string, userId: string): Promise<AgencyDAO | null> {    
    const updated= await setOwner(agencyId, userId)

    revalidatePath("/admin/agencies")

    return updated as AgencyDAO
}