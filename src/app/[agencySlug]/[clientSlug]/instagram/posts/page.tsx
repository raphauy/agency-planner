import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getClientDAOBySlug } from "@/services/client-services"
import { redirect } from "next/navigation"
import IgPost from "./ig-post"
import { PostForm } from "./post-form"
import { getPublicationDAO, getPublicationsDAOByClientSlug } from "@/services/publication-services"
import FeedBox from "./feed-box"
import Feed from "./feed"
import IgBox from "./ig-box"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

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

    return (
      <div className="w-full md:max-w-5xl max-w-[500px]">

        <div className="w-full flex justify-end my-4">
          <Link href={`/${agencySlug}/${client.slug}/instagram?newPost=true`}>
            <Button>
              <PlusCircle size={22} className="mr-2" />
              Crear post
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Feed posts={posts} />
          

          {newPost &&<PostForm />}

          {post && !newPost && edit && <PostForm id={post.id} />}

          {post && !newPost && !edit && <IgBox post={post} clientImage={client.image} clientHandle={client.igHandle} agencySlug={agencySlug} />}

        </div>

      </div>
    )
}
    