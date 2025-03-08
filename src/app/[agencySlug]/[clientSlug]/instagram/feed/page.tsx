import { Button } from "@/components/ui/button"
import { getCurrentRole } from "@/lib/utils"
import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getClientDAOBySlugs } from "@/services/client-services"
import { PublicationDAO, getPublicationDAO, getPublicationsDAOByClient } from "@/services/publication-services"
import { PublicationStatus, PublicationType, UserRole } from "@prisma/client"
import { Camera, GalleryHorizontalEnd, PlusIcon, Video } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import Feed from "./feed"
import IgBox from "./ig-box"
import { PostForm } from "./post-form"

type Props = {
    params: Promise<{
        agencySlug: string
        clientSlug: string
    }>
    searchParams: Promise<{
      post: string
      newPost?: string
      type?: string
      edit: string
    }>
}

export default async function FeedPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { agencySlug, clientSlug } = params
  const agency= await getAgencyDAOBySlug(agencySlug)
  const client= await getClientDAOBySlugs(agencySlug, clientSlug)
  if (!agency || !client) {
    redirect("/auth/404")
  }

  const currentRole= await getCurrentRole()
  if (!currentRole) redirect("/auth/404")

  const isClient= currentRole === UserRole.CLIENT_ADMIN || currentRole === UserRole.CLIENT_USER

  const allPosts= await getPublicationsDAOByClient(client.id)

  const filteredByRole= filterPublicationsByRole(allPosts, currentRole)
  const posts= filteredByRole.filter((post) => post.type !== PublicationType.INSTAGRAM_STORY)

  let postId= searchParams.post
  if (!postId && postId !== "new-post" && posts.length > 0) {
    postId= posts[0].id    
  }

  const post= postId && (await getPublicationDAO(postId))

  const newPost= searchParams.newPost === "true"
  const edit= searchParams.edit === "true"
  const type= searchParams.type as PublicationType || undefined

  const cloudinaryPreset= agency.publicPreset ? agency.publicPreset : process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
  const cloudName= agency.storageCloudName ? agency.storageCloudName : process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!

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
        

        {newPost &&<PostForm type={type} defaultHashtags={client.defaultHashtags || "#"+client.igHandle} cloudinaryPreset={cloudinaryPreset} cloudName={cloudName} />}

        {post && !newPost && edit && <PostForm id={post.id} defaultHashtags={client.defaultHashtags || "#"+client.igHandle} cloudinaryPreset={cloudinaryPreset} cloudName={cloudName} />}

        {post && !newPost && !edit && <IgBox post={post} clientImage={client.image} clientHandle={client.igHandle} agencySlug={agencySlug} cloudinaryPreset={cloudinaryPreset} cloudName={cloudName} clientSlug={clientSlug} />}

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