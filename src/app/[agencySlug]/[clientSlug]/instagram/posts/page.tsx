import { Button } from "@/components/ui/button"
import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getClientDAOBySlug } from "@/services/client-services"
import { getPublicationDAO, getPublicationsDAOByClientSlug } from "@/services/publication-services"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import Feed from "./feed"
import IgBox from "./ig-box"
import { PostForm } from "./post-form"
import { getCurrentRole } from "@/lib/utils"
import { UserRole } from "@prisma/client"

type Props = {
    params: {
        agencySlug: string
        clientSlug: string
    }
    searchParams: {
      post: string
      newPost: string
      edit: string
    }
}

export default async function InstagramPage({ params, searchParams }: Props) {
    const { agencySlug, clientSlug } = params
    const agency= await getAgencyDAOBySlug(agencySlug)
    const client= await getClientDAOBySlug(clientSlug)
    if (!agency || !client) {
      redirect("/auth/404")
    }

    const posts= await getPublicationsDAOByClientSlug(clientSlug)
  
    let postId= searchParams.post
    if (!postId && postId !== "new-post" && posts.length > 0) {
      postId= posts[0].id    
    }

    const post= postId && await getPublicationDAO(postId)

    const newPost= searchParams.newPost === "true"
    const edit= searchParams.edit === "true"

    const currentRole= await getCurrentRole()
    const isClient= currentRole === UserRole.CLIENT_ADMIN || currentRole === UserRole.CLIENT_USER

    return (
      <div className="w-full md:max-w-5xl max-w-[500px]">

        {!isClient ?
          <div className="w-full flex justify-end my-4">
            <Link href={`/${agencySlug}/${client.slug}/instagram/posts?newPost=true`}>
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

          <Feed posts={posts} />
          

          {newPost &&<PostForm />}

          {post && !newPost && edit && <PostForm id={post.id} />}

          {post && !newPost && !edit && <IgBox post={post} clientImage={client.image} clientHandle={client.igHandle} agencySlug={agencySlug} />}

        </div>

      </div>
    )
}
    