"use server"
  
import { revalidatePath } from "next/cache"
import { FieldDAO, FieldFormValues, createField, updateField, getFieldDAO, deleteField, updateRepoFieldsOrder } from "@/services/field-services"

export async function getFieldDAOAction(id: string): Promise<FieldDAO | null> {
    return getFieldDAO(id)
}

export async function createOrUpdateFieldAction(id: string | null, data: FieldFormValues): Promise<FieldDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateField(id, data)
    } else {
        updated= await createField(data)
    }     

    revalidatePath("/whatsapp/fields")

    return updated as FieldDAO
}

export async function deleteFieldAction(id: string): Promise<FieldDAO | null> {    
    const deleted= await deleteField(id)

    revalidatePath("/whatsapp/fields")

    return deleted as FieldDAO
}
    
export async function updateRepoFieldOrderAction(fields: FieldDAO[]) {
    
    const repositoryId= await updateRepoFieldsOrder(fields)

    revalidatePath(`/admin/repositories/${repositoryId}`)    
}
