import { Button } from "@/components/ui/button"
import { getCurrentRole } from "@/lib/utils"
import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getClientDAOBySlugs } from "@/services/client-services"
import { getPublicationDAO, getPublicationsDAOByClientAndType } from "@/services/publication-services"
import { PublicationType, UserRole } from ".prisma/client"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import IgBox from "../feed/ig-box"
import { PostForm } from "../feed/post-form"
import Feed from "./feed"

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

export default async function ReelsPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { agencySlug, clientSlug } = params
  const agency= await getAgencyDAOBySlug(agencySlug)
  const client= await getClientDAOBySlugs(agencySlug, clientSlug)
  if (!agency || !client) {
    redirect("/auth/404")
  }

  const currentRole= await getCurrentRole()
  const isClient= currentRole === UserRole.CLIENT_ADMIN || currentRole === UserRole.CLIENT_USER

  const posts= await getPublicationsDAOByClientAndType(client.id, PublicationType.INSTAGRAM_REEL, isClient)

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
            <Link href={`/${agencySlug}/${client.slug}/instagram/reels?newPost=true&type=INSTAGRAM_REEL`}>
              <Button>
                <PlusCircle size={22} className="mr-2" />
                Crear reel
              </Button>
            </Link>
        </div>
      : 
      <p className="mt-10"/>
      }

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <Feed posts={posts} title="Reels" />
        

        {newPost &&<PostForm type={type} defaultHashtags={client.defaultHashtags || "#"+client.igHandle} cloudinaryPreset={cloudinaryPreset} cloudName={cloudName} />}

        {post && !newPost && edit && <PostForm id={post.id} defaultHashtags={client.defaultHashtags || "#"+client.igHandle} type={type} cloudinaryPreset={cloudinaryPreset} cloudName={cloudName} />}

        {post && !newPost && !edit && <IgBox post={post} clientImage={client.image} clientHandle={client.igHandle} agencySlug={agencySlug} cloudinaryPreset={cloudinaryPreset} cloudName={cloudName} clientSlug={clientSlug} />}

      </div>

    </div>
  )
}
    