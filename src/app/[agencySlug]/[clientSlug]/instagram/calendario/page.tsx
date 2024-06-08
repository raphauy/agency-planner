import CalendarRC from "./CalendarRC";
import CalendarBox from "./calendar-box";
import { Event } from './CustomEvent';
import { getPublicationsDAOByClientSlug } from "@/services/publication-services";
import { isSameDay } from "date-fns";

const myEventsList: Event[] = [
  {
    title: 'Reunión de Proyecto',
    start: new Date(2024, 5, 10, 10, 0), // 10 de junio de 2024, 10:00 AM
    end: new Date(2024, 5, 10, 11, 0), // 10 de junio de 2024, 11:00 AM
    href: 'https://www.google.com',
    image: 'https://res.cloudinary.com/dtm41dmrz/image/upload/c_fill,w_800/v1/tinta-posts/r8ptqegbwok31nqnasa6.jpg?_a=DAJAUVWIZAA0',
    color: '#FDEBD0',
    fechaImportante: "hola",
    status: "PENDING",
    content: "contenido",
  },
  {
    title: 'Presentación de Resultados',
    start: new Date(2024, 5, 15, 14, 0), // 15 de junio de 2024, 2:00 PM
    end: new Date(2024, 5, 15, 15, 0), // 15 de junio de 2024, 3:00 PM
    image: 'https://res.cloudinary.com/dtm41dmrz/image/upload/c_fill,w_800/v1/tinta-posts/r8ptqegbwok31nqnasa6.jpg?_a=DAJAUVWIZAA0',
    href: `#` ,
    color: '#FDEBD0',
    fechaImportante: "",
    status: "PENDING",
    content: "contenido",
  },
]

type Props= {
  params: {
    agencySlug: string;
    clientSlug: string;
  }
}
export default async function CalendarPage({ params }: Props) {

  const agencySlug= params.agencySlug
  const clientSlug= params.clientSlug

  const posts= await getPublicationsDAOByClientSlug(clientSlug)

  const filteredPosts= posts.filter((post): post is { publicationDate: Date } & typeof post => post.publicationDate !== null)
  const events: Event[] = filteredPosts
    .map((post) => {
      const image= post.images?.length && post.images?.length > 0 ? post.images.split(",")[0] :  "/image-placeholder.png"
      
      return {
        title: post.title,
        start: post.publicationDate,
        end: post.publicationDate,
        image,
        color: post.pilar?.color || '#FFFFFF',
        fechaImportante: "",
        status: post.status,
        content: post.copy || "",
        href: `/${agencySlug}/${clientSlug}/instagram/posts?post=${post.id}`,
        compact: filteredPosts.filter((p) => isSameDay(p.publicationDate, post.publicationDate)).length > 1,
      }
    })

  return (
    <div className="w-full mt-2 flex flex-col h-full p-3 bg-gray-200 border border-gray-300 rounded-xl min-w-[600px]">
      {/* <CalendarRC events={myEventsList}></CalendarRC> */}
      <CalendarBox events={events} />
    </div>
  )
}

