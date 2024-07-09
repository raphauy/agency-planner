"use server"

import { setPrompt } from "@/services/client-services"
import { revalidatePath } from "next/cache"

export async function setPromptAction(clienteId: string, prompt: string): Promise<boolean> {

    const client= await setPrompt(clienteId, prompt)

    revalidatePath(`/${client.agency.slug}/${client.slug}/copy-lab/settings`)

    return true
}
