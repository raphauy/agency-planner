"use server"
  
import { deleteRepoData, getRepoDataDAO, RepoDataDAO } from "@/services/repodata-services"
import { revalidatePath } from "next/cache"


export async function deleteRepoDataAction(id: string): Promise<RepoDataDAO | null> {    
    const deleted= await deleteRepoData(id)

    revalidatePath(`/[agencySlug]/[clientSlug]/whatsapp/registros`, "page")

    return deleted as RepoDataDAO
}

