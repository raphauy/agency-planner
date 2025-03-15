"use server"
  
import { ImportedContactDAO, ImportedContactFormValues, createImportedContact, deleteImportedContact, fireProcessPendingContactsAPI, getImportedContactDAO, updateImportedContact } from "@/services/imported-contacts-services"
import { revalidatePath } from "next/cache"
import { ContactCSV } from "./csv-importer"

export async function getImportedContactDAOAction(id: string): Promise<ImportedContactDAO | null> {
    return getImportedContactDAO(id)
}

export async function createOrUpdateImportedContactAction(id: string | null, data: ImportedContactFormValues): Promise<ImportedContactDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateImportedContact(id, data)
    } else {
        updated= await createImportedContact(data)
    }

    fireProcessPendingContactsAPI()

    // sleep 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    revalidatePath("/crm/importedContacts")

    return updated as ImportedContactDAO
}

export async function deleteImportedContactAction(id: string): Promise<ImportedContactDAO | null> {    
    const deleted= await deleteImportedContact(id)

    revalidatePath("/crm/importedContacts")

    return deleted as ImportedContactDAO
}

export async function saveCSVContactsAction(clientId: string, contacts: ContactCSV[]) {
    for (const contact of contacts) {
        try {
            const data: ImportedContactFormValues= {
                name: contact.nombre,
                phone: contact.telefono,
                tags: contact.etiquetas?.replace(/;/g, ","),
                stageName: contact.estado,
                type: "CSV",
                clientId: clientId
            }
            const created= await createImportedContact(data)
            if (created) {
                console.log("contacto ingresado: ", created.name)
            } else {
                console.log("error al ingresar contacto: ", contact.nombre)
            }
        } catch (error) {
            console.log("error: ", error)
        }
    }

    fireProcessPendingContactsAPI()

    revalidatePath("/crm/importedContacts")

    return true
}