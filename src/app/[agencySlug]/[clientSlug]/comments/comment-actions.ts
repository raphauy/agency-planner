"use server"
  
import { CommentDAO, CommentFormValues, createComment, deleteComment, getFullCommentDAO, updateComment } from "@/services/comment-services"
import { revalidatePath } from "next/cache"


export async function getCommentDAOAction(id: string): Promise<CommentDAO | null> {
    return getFullCommentDAO(id)
}

export async function createOrUpdateCommentAction(id: string | null, data: CommentFormValues): Promise<CommentDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateComment(id, data)
    } else {
        updated= await createComment(data)
    }     

    revalidatePath("/[clientSlug]/comments", "page")

    return updated as CommentDAO
}

export async function deleteCommentAction(id: string): Promise<CommentDAO | null> {    
    const deleted= await deleteComment(id)

    revalidatePath("/[clientSlug]/comments", "page")

    return deleted as CommentDAO
}

