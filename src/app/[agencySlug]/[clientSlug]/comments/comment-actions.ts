"use server"
  
import { CommentDAO, CommentFormValues, createComment, deleteComment, getFullCommentDAO, updateComment } from "@/services/comment-services"
import { getAgencyListeners, getListeners, getPublicationDAO, getPublicationDAOWithAgency } from "@/services/publication-services"
import { getUserDAO } from "@/services/user-services"
import { revalidatePath } from "next/cache"
import { Knock } from "@knocklabs/node";
import { getPublicationPath } from "@/lib/utils"


const knock = new Knock(process.env.KNOCK_API_SECRET)

export async function getCommentDAOAction(id: string): Promise<CommentDAO | null> {
    return getFullCommentDAO(id)
}

export async function createOrUpdateCommentAction(id: string | null, data: CommentFormValues): Promise<CommentDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateComment(id, data)
    } else {
        updated= await createComment(data)
        await createNotificatioin(data)    
    }     

    revalidatePath("/[clientSlug]/comments", "page")

    return updated as CommentDAO
}

export async function deleteCommentAction(id: string): Promise<CommentDAO | null> {    
    const deleted= await deleteComment(id)

    revalidatePath("/[clientSlug]/comments", "page")

    return deleted as CommentDAO
}


async function createNotificatioin(data: CommentFormValues) {
    if (data.userId) {
        const user= await getUserDAO(data.userId)
        const publication= await getPublicationDAOWithAgency(data.publicationId)

        if (!user || !publication) return

        console.log("sending notification on comment")

        let listeners
        if (publication.status === "BORRADOR") {
            listeners= await getAgencyListeners(data.publicationId)
        } else {
            listeners= await getListeners(data.publicationId)
        }

        const recipients= listeners
            .filter(listener => listener.id !== user.id)
            .map(listener => {
                let altImage= publication.client.image
                if (listener.role.startsWith("AGENCY")) {
                    altImage= publication.client.agency.image
                }
        
                return({
                id: listener.id,
                name: listener.name || "",
                email: listener.email,
                avatar: listener.image || altImage
            })})

        if (recipients.length === 0) {
            console.log("no recipients to send notification on comment for publication " + publication.title)
            return
        }

        // add the user with id=1 to the recipients list
        recipients.push({
            id: "cluo7tz8m0000x80anh92w0lo",
            name: "Rapha",
            email: "rapha.uy@rapha.uy",
            avatar: "https://res.cloudinary.com/dcy8vuzjb/image/upload/v1716484248/338162469_547239864190963_5444624864328212444_n.jpg_pbeagu.jpg"
        })

        const publicationPath= getPublicationPath(publication.type)
      
        await knock.users.identify(user.id, {
            name: user.name,
            email: user.email,
            avatar: user.image
        });

        await knock.workflows.trigger("comment-created", {
            actor: user.id,
            data: {
                name: user.name || "",
                title: publication.title,
                clientName: publication.client.name,
                publicationUrl: `/${publication.client.agency.slug}/${publication.client.slug}/${publicationPath}?post=${publication.id}#comments`,
            },
            recipients
        })

    } else {
        console.log("no userId to send notification on comment")
    }

}