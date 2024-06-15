import { Button } from "@/components/ui/button"
import { getCurrentRole } from "@/lib/utils"
import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getClientDAOBySlug } from "@/services/client-services"
import { getPublicationDAO, getPublicationsDAOByClientAndType } from "@/services/publication-services"
import { PublicationType, UserRole } from "@prisma/client"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import Feed from "../feed/feed"
import IgBox from "../feed/ig-box"
import { PostForm } from "../feed/post-form"

type Props = {
    params: {
        agencySlug: string
        clientSlug: string
    }
    searchParams: {
      post: string
      newPost?: string
      type?: string
      edit: string
    }
}

export default async function PostsPage({ params, searchParams }: Props) {
    const { agencySlug, clientSlug } = params
    const agency= await getAgencyDAOBySlug(agencySlug)
    const client= await getClientDAOBySlug(clientSlug)
    if (!agency || !client) {
      redirect("/auth/404")
    }

    const posts= await getPublicationsDAOByClientAndType(client.id, PublicationType.INSTAGRAM_POST)
  
    let postId= searchParams.post
    if (!postId && postId !== "new-post" && posts.length > 0) {
      postId= posts[0].id    
    }

    const post= postId && await getPublicationDAO(postId)

    const newPost= searchParams.newPost === "true"
    const edit= searchParams.edit === "true"
    const type= searchParams.type as PublicationType || undefined

    const currentRole= await getCurrentRole()
    const isClient= currentRole === UserRole.CLIENT_ADMIN || currentRole === UserRole.CLIENT_USER

    return (
      <div className="w-full md:max-w-5xl max-w-[500px]">

        {!isClient ?
          <div className="w-full flex justify-end my-4 gap-2">
              <Link href={`/${agencySlug}/${client.slug}/instagram/posts?newPost=true&type=INSTAGRAM_POST`}>
                <Button>
                  <PlusCircle size={22} className="mr-2" />
                  Crear post
                </Button>
              </Link>
          </div>
        : 
        <p className="mt-10"/>
        }

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Feed posts={posts} title="Reels" />
          

          {newPost &&<PostForm type={type} />}

          {post && !newPost && edit && <PostForm id={post.id} />}

          {post && !newPost && !edit && <IgBox post={post} clientImage={client.image} clientHandle={client.igHandle} agencySlug={agencySlug} />}

        </div>

      </div>
    )
}
    