import { CommentDialog, DeleteCommentDialog } from "@/app/[agencySlug]/[clientSlug]/comments/comment-dialogs"
import { CommentForm } from "@/app/[agencySlug]/[clientSlug]/comments/comment-forms"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCurrentUser } from "@/lib/utils"
import { getFullCommentsDAO } from "@/services/comment-services"
import { PublicationDAO } from "@/services/publication-services"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

type Props= {
  publication: PublicationDAO
}
export async function Comments({ publication }: Props) {

  const currentUser= await getCurrentUser()
  if (!currentUser || !currentUser.id) return <div>Para enviar comentarios, debes estar logueado</div>

  const comments= await getFullCommentsDAO(publication.id)

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Comentarios</h2>
        <div className="space-y-4">
        {
          comments.length > 0 &&
          comments.map((comment) => {
            if (!comment.user) return (
              <div key={comment.id} className="flex flex-col items-center">
                <div className="bg-gray-100 px-3 py-1 text-[10px] rounded-full text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  {comment.text}
                </div>
                <div className="text-[9px] text-gray-500 dark:text-gray-400">{formatDistanceToNow(comment.updatedAt, {locale: es})}</div>
              </div>    
            )
            
            return (
              <div key={comment.id} className="flex items-start gap-2 w-full">
                <Avatar className="w-10 h-10 border">
                  <AvatarImage alt="@shadcn" src={comment.userImage || "/placeholder-user.jpg"} />
                  <AvatarFallback>{comment.userName?.substring(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1.5 border-b w-full">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{comment.userName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{formatDistanceToNow(comment.updatedAt, {locale: es})}</div>
                    </div>
                    {
                      currentUser?.id === comment.userId &&
                      <div className="flex items-center">
                        <CommentDialog publicationId={publication.id} userId={comment.userId} id={comment.id} text={comment.text} />
                        {/* <DeleteCommentDialog id={comment.id} description="Seguro que quieres eliminar este comentario?" /> */}
                      </div>
                    }
                  </div>
                  <div className="flex justify-between">
                    <p className="break-words whitespace-pre-wrap">{comment.text}</p>
                    <p className="text-[10px]">{comment.edited ? "Editado" : ""}</p>
                  </div>
                </div>
              </div>
              )
          })
        }
        </div>
      </div>
      <CommentForm publicationId={publication.id} userId={currentUser.id} />
    </div>
  )
}
