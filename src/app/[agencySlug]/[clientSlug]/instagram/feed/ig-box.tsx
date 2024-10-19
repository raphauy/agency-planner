import { Comments } from "@/components/comments"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getCurrentRole } from "@/lib/utils"
import { getListeners, getTeamMembers, PublicationDAO } from "@/services/publication-services"
import { PublicationType, UserRole } from "@prisma/client"
import { format as formatTz, toZonedTime } from 'date-fns-tz'
import { es } from "date-fns/locale"
import { Camera, Download, GalleryHorizontal, GalleryHorizontalEnd, Heart, MessageCircle, Pencil, Send, Video } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import slugify from 'slugify'
import { AgencyPubStatusSelector } from "./agency-status-selector"
import { ClientPubStatusSelector } from "./client-status-selector"
import CopyBox from "./copy-box"
import IgCarousel from "./ig-carousel"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import NotificationsBox from "./notifications-box"

type Props= {
    post: PublicationDAO
    clientImage?: string
    clientHandle?: string
    agencySlug: string
  }
  
export default async function IgBox({ post, clientImage, clientHandle, agencySlug }: Props) {

    const images= post.images ? post.images.split(",") : []

    clientImage= clientImage || "/user-placeholder.jpg"
    clientHandle= clientHandle || "definir-ig-handle"

    const slugifiedTitle= post.images ? slugify(post.title, { replacement: "_", lower: true }) : ""

    const currentRole= await getCurrentRole()
    const isClient= currentRole === UserRole.CLIENT_ADMIN || currentRole === UserRole.CLIENT_USER

    const zonedDate = post.publicationDate ? toZonedTime(post.publicationDate, "America/Montevideo") : null

    const teamMembers= await getTeamMembers(post.id)

    return (
      <div>

        <div className="p-4 justify-self-center bg-white dark:bg-black border rounded-3xl min-w-[360px] max-w-[500px]">
    
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative inline-block w-8 h-8 overflow-hidden border rounded-full md:h-11 md:w-11">            
                <Image src={clientImage} alt="Client's logo" width={100} height={100} />
              </div>
              <p className="pl-2 text-sm font-semibold">{clientHandle}</p>
            </div>
            <div className="flex items-center">
              <Badge>{getLabel(post.type)}</Badge>
              {
                !isClient &&
                <Link href={`?post=${post.id}&edit=true`}>
                  <Button variant="ghost"><Pencil /></Button>
                </Link>
              }
            </div>
          </div>
    
          {/* Carousel */}
          <IgCarousel initialImages={images} />

          {/* Buttons */}
          <div className="flex justify-between pl-2 pt-4">
            <div className="flex space-x-4">
              <Heart size={26}/>
              <MessageCircle size={24}/>
              <Send size={24}/>
            </div>
            <CopyBox text={prepareCopyText(post)} />
          </div>

          {/* Title */}
          <p className="p-3 whitespace-pre-line">
            <span className="mr-1 font-bold">{post.client.igHandle} </span>
            {post.copy}            
          </p>
          {
            post.type !== "INSTAGRAM_STORY" &&
            <p className="p-3 font-bold">
              {post.hashtags}
            </p>
          }

        </div>
        
        <div className="p-4 flex justify-between mt-4 bg-white dark:bg-black border rounded min-w-[380px] max-w-[500px]">
          <div className="grid grid-cols-[111px,1fr]">
            <p className="font-bold">Título:</p>      
            <p className="flex-1">{post.title}</p>      
            <p className="font-bold">Pilar:</p>      
            <p>{post.pilar?.name}</p>
            <p className="font-bold ">Fecha:</p>
            <p>{zonedDate && formatTz(zonedDate, 'PPP', { locale: es })}</p>
            
          </div>
          {post.type === "INSTAGRAM_POST" && images.length > 1 ? <GalleryHorizontal /> : null}
          {post.type === "INSTAGRAM_POST" && images.length === 1 ? <Camera /> : null}
          {post.type === "INSTAGRAM_REEL" ? <Video /> : null}
          {post.type === "INSTAGRAM_STORY" ? <GalleryHorizontalEnd /> : null}
        </div>

        <div className="p-4 mt-4 bg-white dark:bg-black border rounded w-full flex justify-center">
          {
            isClient ?
            <ClientPubStatusSelector id={post.id} status={post.status} />
            :
            <AgencyPubStatusSelector id={post.id} status={post.status} />
          }          
        </div>

        <div className='p-4 mt-4 bg-white border rounded min-w-[400px] max-w-[500px] grid-cols-2 xl:grid-cols-3 grid gap-4'>
          {images.map((url, index) => {

            const title= slugifiedTitle+(index===0 ? "" : "_"+(index+1))

            const isImage= url.includes(".jpg") || url.includes(".png") || url.includes(".jpeg")

            return (
              <Link  key={index} href={`/api/download?title=${title}&url=${url}`} prefetch={false}>
                <button className='flex items-center gap-1 p-1 border rounded'>
                  {
                    isImage ?
                    <Image src={url} width={100} height={100} alt={title} />
                    :
                    <p>video</p>
                  }                
                  <Download size={30} className='text-gray-600'/>
                </button>
              </Link>
            )})}
          </div>

          <div className='p-4 mt-4 bg-white border rounded gap-4' id="comments">

            <Comments publication={post} />

            {
              !isClient &&
              <Accordion type="single" collapsible className="mt-10">
                <AccordionItem value="Notas del presupuesto" className="border-none">
                    <AccordionTrigger>
                        <p className="font-bold text-lg">Notificaciones</p>
                    </AccordionTrigger>
                    <AccordionContent>
                        <NotificationsBox publicationId={post.id} team={teamMembers} />
                    </AccordionContent>
                </AccordionItem>
              </Accordion>
            }

          </div>

      </div>

      

    )
}
    
function prepareCopyText(post: PublicationDAO) {
  let text= post.copy || ""
  if (post.hashtags)
    text= text + "\n\n" + post.hashtags

  return text  
}

export function getLabel(type: PublicationType) {
  switch (type) {
    case PublicationType.INSTAGRAM_POST:
      return "POST"
    case PublicationType.INSTAGRAM_REEL:
      return "REEL"
    case PublicationType.INSTAGRAM_STORY:
      return "HISTORIA"
    default:
      return ""
  }
}