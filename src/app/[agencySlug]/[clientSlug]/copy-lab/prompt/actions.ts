"use server"

import { setPrompt } from "@/services/client-services"
import { PromptFormValues } from "./prompt-form"
import { revalidatePath } from "next/cache"

export async function updatePromptAction(data: PromptFormValues) {

    if (!data.prompt || !data.clienteId)
        return false

    const client= await setPrompt(data.clienteId, data.prompt)

    revalidatePath(`/${client.agency.slug}/${client.slug}/copy-lab/prompt`)

    return true
}
