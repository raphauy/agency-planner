import { Button } from "@/components/ui/button"
import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getClientDAOBySlug } from "@/services/client-services"
import { PublicationDAO, getPublicationDAO, getPublicationsDAOByClientSlug } from "@/services/publication-services"
import { Camera, GalleryHorizontalEnd, PlusCircle, PlusIcon, Video } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import Feed from "./feed"
import IgBox from "./ig-box"
import { PostForm } from "./post-form"
import { getCurrentRole } from "@/lib/utils"
import { PublicationStatus, PublicationType, UserRole } from "@prisma/client"

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

export default async function FeedPage({ params, searchParams }: Props) {
    const { agencySlug, clientSlug } = params
    const agency= await getAgencyDAOBySlug(agencySlug)
    const client= await getClientDAOBySlug(clientSlug)
    if (!agency || !client) {
      redirect("/auth/404")
    }

    const allPosts= await getPublicationsDAOByClientSlug(clientSlug)
    const currentRole= await getCurrentRole()
    if (!currentRole) redirect("/auth/404")
    
    const filteredByRole= filterPublicationsByRole(allPosts, currentRole)
    const posts= filteredByRole.filter((post) => post.type !== PublicationType.INSTAGRAM_STORY)
  
    let postId= searchParams.post
    if (!postId && postId !== "new-post" && posts.length > 0) {
      postId= posts[0].id    
    }

    const post= postId && await getPublicationDAO(postId)

    const newPost= searchParams.newPost === "true"
    const edit= searchParams.edit === "true"
    const type= searchParams.type as PublicationType || undefined
    console.log("type:", type)
    

    const isClient= currentRole === UserRole.CLIENT_ADMIN || currentRole === UserRole.CLIENT_USER

    return (
      <div className="w-full md:max-w-5xl max-w-[500px]">

        {!isClient ?
          <div className="w-full flex justify-end my-4 gap-2">
              <Link href={`/${agencySlug}/${client.slug}/instagram/posts?newPost=true&type=INSTAGRAM_POST`}>
                <Button className="w-44">
                  <PlusIcon size={20} className="mr-1" />
                  Crear post
                  <Camera size={20} className="ml-2" />
                </Button>
              </Link>
              <Link href={`/${agencySlug}/${client.slug}/instagram/reels?newPost=true&type=INSTAGRAM_REEL`}>
                <Button className="w-44">
                  <PlusIcon size={20} className="mr-1" />
                  Crear reel
                  <Video size={22} className="ml-2" />
                </Button>
              </Link>
              <Link href={`/${agencySlug}/${client.slug}/instagram/historias?newPost=true&type=INSTAGRAM_STORY`}>
                <Button className="w-44">
                  <PlusIcon size={20} className="mr-1" />
                  Crear historia
                  <GalleryHorizontalEnd size={22} className="ml-2" />
                </Button>
              </Link>
          </div>
        : 
        <p className="mt-10"/>
        }

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Feed posts={posts} title="Feed" />
          

          {newPost &&<PostForm type={type} />}

          {post && !newPost && edit && <PostForm id={post.id} />}

          {post && !newPost && !edit && <IgBox post={post} clientImage={client.image} clientHandle={client.igHandle} agencySlug={agencySlug} />}

        </div>

      </div>
    )
}
    

function filterPublicationsByRole(publications: PublicationDAO[], currentRole: UserRole) {
  return publications.filter((publication) => {
    if (currentRole === "CLIENT_ADMIN" || currentRole === "CLIENT_USER") {
      if (publication.status !== PublicationStatus.BORRADOR) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  })
}