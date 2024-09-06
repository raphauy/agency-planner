// model Client {
//     id                String    @id @default(cuid())
//     name              String                    // gennext: show.column
//     slug              String                    // gennext: show.column 
//     image             String?                   // gennext: show.column
//     description       String?                   // gennext: show.column
//     igHandle          String?                   // gennext: show.column
//     brandVoice        String?
//     prompt            String? @default("Eres un experto copywriter que ayuda al usuario copys para publicaciones de redes sociales...")
//     copyPrompt        String? @default("Escribe el copy basado en el título...")
//     defaultHashtags   String? @default("")
//     includeBrandVoice Boolean? @default(false)
//     includeLastCopys  Boolean? @default(false)

import { prisma } from "@/lib/db";
import { Pilar } from "@prisma/client";

//     createdAt         DateTime  @default(now()) // gennext: skip.zod
//     updatedAt         DateTime  @updatedAt      // gennext: skip.zod

//     users             User[]
//     agency            Agency  @relation(fields: [agencyId], references: [id], onDelete: Cascade)  
//     agencyId          String

//     functionalities   Functionality[]
//     publications      Publication[]
//     pilars            Pilar[]
//     channels          Channel[]
//     invitations       Invitation[]
//     documents         Document[]
//     conversations     Conversation[]
//     usageRecords      UsageRecord[]
//     monthlyUsages     MonthlyUsage[]    
// }



// esta función recibe un id de cliente a duplicar y un id de agencia destino
// y duplica el cliente en la agencia destino
// si el cliente ya existe en la agencia destino, no hace nada
// si el cliente no existe en la agencia destino, crea uno nuevo
// campos a duplicar:
// name, slug, image, description, igHandle, brandVoice, prompt, copyPrompt, defaultHashtags, includeBrandVoice, includeLastCopys
// campos a ignorar:
// id, createdAt, updatedAt
// campos a modificar:
// agencyId poner el id de la agencia destino
// detalles de cada colección a duplicar:
// publications:
// para cada publicación, se crea una nueva con los mismos datos pero con el cliente destino
// pilars:
// para cada pilar, se crea una nueva con los mismos datos pero con el cliente destino
// channels:
// para cada canal, se crea una nueva con los mismos datos pero con el cliente destino
// documents:
// para cada document, se crea una nueva con los mismos datos pero con el cliente destino
// las demás colecciones no se duplican
export async function duplicateClient(clientId: string, agencyId: string) {
    console.log("duplicating client", clientId, agencyId);
    
    const clientOnlyFields = await prisma.client.findUnique({
        where: { 
            id: clientId 
        },
    });

    if (!clientOnlyFields) {
        throw new Error("Client not found 1")
    }

    const duplicatedClient = await prisma.client.create({
        data: {
            agencyId: agencyId,
            name: clientOnlyFields.name,
            slug: clientOnlyFields.slug,
            image: clientOnlyFields.image,
            description: clientOnlyFields.description,
            igHandle: clientOnlyFields.igHandle,
            brandVoice: clientOnlyFields.brandVoice,
            prompt: clientOnlyFields.prompt,
            copyPrompt: clientOnlyFields.copyPrompt,
            defaultHashtags: clientOnlyFields.defaultHashtags,
            includeBrandVoice: clientOnlyFields.includeBrandVoice,
            includeLastCopys: clientOnlyFields.includeLastCopys,
        }
    })

    const fullClient= await prisma.client.findUnique({
        where: { id: clientId },
        include: {
            publications: {
                include: {
                    pilar: true
                }
            },
            channels: true,
            documents: true,
        }
    })

    if (!fullClient) {
        throw new Error("Client not found 2")
    }

    const createdPilars: Pilar[]= []


    // iterar sobre cada publicaciones y duplicarlas
    for (const publication of fullClient.publications) {
        // para cada publicación, buscar el pilar correspondiente según el nombre
        let pilar = createdPilars.find(pilar => pilar.name === publication.pilar?.name)
        // si no existe, crear uno nuevo
        if (!pilar) {
            pilar = await prisma.pilar.create({
                data: {
                    name: publication.pilar?.name || "Cambiar nombre",
                    description: publication.pilar?.description || "",
                    color: publication.pilar?.color || "#000000",
                    clientId: duplicatedClient.id
                }
            })
            createdPilars.push(pilar)
        }
        await prisma.publication.create({
            data: {
                pilarId: pilar.id,
                clientId: duplicatedClient.id,
                type: publication.type,
                title: publication.title,
                images: publication.images,
                copy: publication.copy,
                hashtags: publication.hashtags,
                publicationDate: publication.publicationDate,
                status: publication.status,                
            }
        })
    }

    // duplicar documentos
    for (const document of fullClient.documents) {
        await prisma.document.create({
            data: {
                clientId: duplicatedClient.id,
                name: document.name,
                description: document.description,
                jsonContent: document.jsonContent,
                textContent: document.textContent,
                type: document.type,
                fileSize: document.fileSize,
                wordsCount: document.wordsCount,
                status: document.status,
                color: document.color,
            }
        })
    }
    
    return duplicatedClient
}