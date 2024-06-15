import * as z from "zod"
import { prisma } from "@/lib/db"
import { getAgencyOfPublication } from "./agency-services"
import { getClientOfPublication } from "./client-services"

export type CommentDAO = {
	id: string
	text: string
  edited: boolean
	createdAt: Date
	updatedAt: Date
	userId: string | null
  userName: string
  userImage: string
	publicationId: string
}

export const commentSchema = z.object({
	text: z.string().min(1, "text is required."),
	userId: z.string().optional(),
	publicationId: z.string().min(1, "publicationId is required."),
})

export type CommentFormValues = z.infer<typeof commentSchema>


export async function getCommentsDAO() {
  const found = await prisma.comment.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as CommentDAO[]
}

export async function getCommentDAO(id: string) {
  const found = await prisma.comment.findUnique({
    where: {
      id
    },
  })
  return found as CommentDAO
}
    
export async function createComment(data: CommentFormValues) {
  // TODO: implement createComment
  const created = await prisma.comment.create({
    data
  })
  return created
}

export async function updateComment(id: string, data: CommentFormValues) {
  const updated = await prisma.comment.update({
    where: {
      id
    },
    data: {
      ...data,
      edited: true
    }
  })
  return updated
}

export async function deleteComment(id: string) {
  const deleted = await prisma.comment.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullCommentsDAO(publicationId: string) {
  const found = await prisma.comment.findMany({
    where: {
      publicationId
    },
    orderBy: {
      createdAt: 'asc'
    },
    include: {
      user: true
		}
  })
  if (!found) return []

  const agency= await getAgencyOfPublication(publicationId)
  if (!agency) throw new Error("No se encontró la agencia de la publicación")
  const client= await getClientOfPublication(publicationId)
  if (!client) throw new Error("No se encontró el cliente de la publicación")

  const res = found.map((comment) => {
    const user= comment.user
    let userName
    let userImage 
    if (user){
      userName= user.name || user.email
      const altImage= user.role.startsWith("CLIENT") ? client.image : user.role.startsWith("AGENCY") ? agency.image : "/user-placeholder.jpg"
      userImage= user.image || altImage
    } else {
      userName= "System"
      userImage= "/user-placeholder.jpg"
    }

    return {
      ...comment,
      userName,
      userImage
    }
  })
  return res
}
  
export async function getAllCommentsDAO() {
  const found = await prisma.comment.findMany({
    orderBy: {
      createdAt: 'asc'
    },
    include: {
      user: true
		}
  })
  if (!found) return []

  const res = found.map((comment) => {
    const user= comment.user
    let userName
    let userImage 
    if (user){
      userName= user.name || user.email
      userImage= user.image || "/user-placeholder.jpg"
    } else {
      userName= "System"
      userImage= "/user-placeholder.jpg"
    }

    return {
      ...comment,
      userName,
      userImage
    }
  })
  return res
}

export async function getFullCommentDAO(id: string) {
  const found = await prisma.comment.findUnique({
    where: {
      id
    },
    include: {
		}
  })
  return found as CommentDAO
}
    