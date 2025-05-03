import { getPublicationsDAOByClientWithFilter } from "@/services/publication-services";
import { isSameDay } from "date-fns";
import { Event } from './CustomEvent';
import CalendarBox from "./calendar-box";
import PublicationTypeFilter from "./pub-type-filter";
import { getCurrentUser } from "@/lib/utils";

type Props= {
  params: Promise<{
    agencySlug: string;
    clientSlug: string;
  }>
  searchParams: Promise<{
    filter: string;
  }>
}
export default async function CalendarPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const filter= searchParams.filter

  const agencySlug= params.agencySlug
  const clientSlug= params.clientSlug

  const user= await getCurrentUser()
  const isClient= user?.role === "CLIENT_ADMIN" || user?.role === "CLIENT_USER"

  const posts= await getPublicationsDAOByClientWithFilter(agencySlug, clientSlug, filter, isClient)

  const filteredPosts= posts.filter((post): post is { publicationDate: Date } & typeof post => post.publicationDate !== null)
  const events: Event[] = filteredPosts
    .map((post) => {
      const images= post.images?.split(",").filter((image) => image.includes(".jpg") || image.includes(".png") || image.includes(".jpeg"))
      const image= images?.length && images?.length > 0 ? images[0] :  "/image-placeholder.png"
      const videos= post.images?.split(",").filter((video) => video.includes(".mp4") || video.includes(".mov") || video.includes(".webm"))
      
      // Crear la URL adecuada según el tipo de publicación
      let href = `/${agencySlug}/${clientSlug}/instagram/feed?post=${post.id}`;
      
      // Para las notas, no usamos una URL normal sino un identificador especial
      // que será manejado en el componente CustomEvent
      if (post.type === "CALENDAR_NOTE") {
        href = `note:${post.id}`;
      }
      
      return {
        id: post.id,
        title: post.title,
        start: post.publicationDate,
        end: post.publicationDate,
        image,
        color: post.pilar?.color || '#FFFFFF',
        fechaImportante: "",
        status: post.status,
        content: post.copy || "",
        href,
        compact: filteredPosts.filter((p) => isSameDay(p.publicationDate, post.publicationDate)).length > 1,
        type: post.type,
      }
    })

  return (
    <div className="h-full mb-16 w-full">

      <div className="w-full flex justify-center mt-1 mb-3 p-3 border rounded-xl min-w-[600px] bg-white dark:bg-gray-800">
        <PublicationTypeFilter />
      </div>

      <div className="w-full flex flex-col h-full p-2 bg-gray-200 border border-gray-300 rounded-xl min-w-[600px]"> 
        <CalendarBox 
          events={events} 
          agencySlug={agencySlug} 
          clientSlug={clientSlug} 
        />
      </div>
    </div>
  )
}

