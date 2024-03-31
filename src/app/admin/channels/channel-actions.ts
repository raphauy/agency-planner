"use server"
  
import { revalidatePath } from "next/cache"
import { ChannelDAO, ChannelFormValues, createChannel, updateChannel, getFullChannelDAO, deleteChannel } from "@/services/channel-services"


export async function getChannelDAOAction(id: string): Promise<ChannelDAO | null> {
    return getFullChannelDAO(id)
}

export async function createOrUpdateChannelAction(id: string | null, data: ChannelFormValues): Promise<ChannelDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateChannel(id, data)
    } else {
        updated= await createChannel(data)
    }     

    revalidatePath("/admin/channels")

    return updated as ChannelDAO
}

export async function deleteChannelAction(id: string): Promise<ChannelDAO | null> {    
    const deleted= await deleteChannel(id)

    revalidatePath("/admin/channels")

    return deleted as ChannelDAO
}

