"use server"

import { setDescription, setImage, setName, setSlug } from "@/services/client-services"
import { revalidatePath } from "next/cache"

export async function setClientNameAction(id: string, name: string): Promise<boolean> {
    const updated= await setName(id, name)

    if (!updated) return false

    revalidatePath(`settings`)

    return true
}

export async function setClientDescriptionAction(id: string, description: string): Promise<boolean> {
    const updated= await setDescription(id, description)

    if (!updated) return false

    revalidatePath(`settings`)

    return true
}

export async function setClientSlugAction(id: string, slug: string): Promise<string> {
    const message= await setSlug(id, slug)

    revalidatePath(`settings`)

    return message
}

export async function setClientImageAction(id: string, image: string): Promise<boolean> {
    console.log('setting image action', image);
    const updated= await setImage(id, image)

    if (!updated) return false

    revalidatePath(`settings`)

    return true
}