"use server"
  
import { checkValidPhone } from "@/lib/utils"
import { RepositoryDAO, addTagToRepository, createRepository, deleteRepository, removeTagFromRepository, setExecutionResponse, setFunctionDescription, setFunctionName, setIsActive, setName, setNotifyPhones, setWebHookUrl } from "@/services/repository-services"
import { revalidatePath } from "next/cache"


export async function createRepositoryAction(name: string, clientId: string): Promise<RepositoryDAO | null> {       
    const created= await createRepository(name, clientId)

    revalidatePath("/[agencySlug]/[clientSlug]/whatsapp/repositories", "page")

    return created as RepositoryDAO
}

export async function deleteRepositoryAction(id: string): Promise<RepositoryDAO | null> {    
    const deleted= await deleteRepository(id)

    revalidatePath("/[agencySlug]/[clientSlug]/whatsapp/repositories", "page")

    return deleted as RepositoryDAO
}

export async function setNameAction(id: string, name: string): Promise<boolean> {
    const updated= await setName(id, name)

    if (!updated) return false

    revalidatePath("/[agencySlug]/[clientSlug]/whatsapp/repositories", "page")

    return true
}

export async function setFunctionNameAction(id: string, functionName: string): Promise<boolean> {
    const updated= await setFunctionName(id, functionName)

    if (!updated) return false

    revalidatePath("/[agencySlug]/[clientSlug]/whatsapp/repositories", "page")

    return true
}

export async function setFunctionDescriptionAction(id: string, functionDescription: string): Promise<boolean> {
    const updated= await setFunctionDescription(id, functionDescription)

    if (!updated) return false

    revalidatePath("/[agencySlug]/[clientSlug]/whatsapp/repositories", "page")

    return true
}   


export async function setExecutionResponseAction(id: string, executionResponse: string): Promise<boolean> {
    const updated= await setExecutionResponse(id, executionResponse)

    if (!updated) return false

    revalidatePath("/[agencySlug]/[clientSlug]/whatsapp/repositories", "page")

    return true
}

export async function setIsActiveAction(id: string, isActive: boolean): Promise<boolean> {
    const updated= await setIsActive(id, isActive)

    if (!updated) return false

    revalidatePath("/[agencySlug]/[clientSlug]/whatsapp/repositories", "page")

    return true
}

export async function setWebHookUrlAction(id: string, webHookUrl: string): Promise<boolean> {
    const updated= await setWebHookUrl(id, webHookUrl)

    if (!updated) return false

    revalidatePath("/[agencySlug]/[clientSlug]/whatsapp/repositories", "page")

    return true
}

export async function setNotifyPhonesAction(id: string, notifyPhones: string): Promise<boolean> {
    if (notifyPhones === "") {
        const updated= await setNotifyPhones(id, [])
        if (!updated) return false
        revalidatePath("/[agencySlug]/[clientSlug]/whatsapp/repositories", "page")
        return true
    }
    const notifyPhonesArray= notifyPhones.split(",").map(phone => phone.trim())
    // if a phone do not have a +, add it
    for (let i = 0; i < notifyPhonesArray.length; i++) {
        if (!notifyPhonesArray[i].startsWith("+")) {
            notifyPhonesArray[i]= "+" + notifyPhonesArray[i]
        }
    }
    // check if all phones are valid
    for (const phone of notifyPhonesArray) {
        console.log("checking phone: ", phone)
        if (!checkValidPhone(phone))
            throw new Error("Teléfono inválido: " + phone)
    }
    const updated= await setNotifyPhones(id, notifyPhonesArray)

    if (!updated) return false

    revalidatePath("/[agencySlug]/[clientSlug]/whatsapp/repositories", "page")

    return true
}

export async function addTagToRepositoryAction(repoId: string, tag: string): Promise<boolean> {
    const updated= await addTagToRepository(repoId, tag)

    if (!updated) return false

    revalidatePath("/[agencySlug]/[clientSlug]/whatsapp/repositories", "page")

    return true
}

export async function removeTagFromRepositoryAction(repoId: string, tag: string): Promise<boolean> {
    const updated= await removeTagFromRepository(repoId, tag)

    if (!updated) return false

    revalidatePath("/[agencySlug]/[clientSlug]/whatsapp/repositories", "page")

    return true
}