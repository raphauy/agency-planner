import Link from "next/link"
import { isBefore } from "date-fns"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Camera, GalleryHorizontalEnd, Video } from "lucide-react"
import { PublicationType } from ".prisma/client"

export interface Event {
  fechaImportante: string
  title: string
  content: string
  start: Date
  end: Date
  image: string
  color: string
  href: string
  status: string
  compact?: boolean
  type: PublicationType
}

interface CustomEventProps {
  event: Event
}

const CustomEvent: React.FC<CustomEventProps> = ({ event }) => {

  const fechasImportantes: string[]= event.fechaImportante.split(",")

  const statusColor= event.status === "APROBADO" ? "bg-green-500" : event.status === "REVISADO" ? "bg-orange-500" : event.status === "PROGRAMADO" ? "bg-sky-500" : event.status === "PUBLICADO" ? "bg-yellow-500" : "bg-gray-500"
  const pastDate= isBefore(event.start, new Date())
  const show= !pastDate && event.status !== "APROBADO"

  return (
    <>
      {
        fechasImportantes.length > 0 &&
        fechasImportantes.map((fecha) => {
          if (!fecha) return null
          
          return (
            <div key={fecha} className="h-5 px-1 mb-1 text-sm font-bold text-gray-600 bg-gray-100 border border-gray-400 rounded-md ">{fecha}</div>
            )
        })        
      }
      {
        event.title && (
          <div className="relative border rounded-md p-0.5" style={{ backgroundColor: `${event.color}`}}> 
            {/* {!pastDate && <ArrowBigRight className={cn("absolute opacity-80 bottom-0 right-0 rounded-md", statusColor)} size={20}/>} */}
            {show && <div className={cn("absolute bottom-0 border border-white right-0 rounded-full w-5 h-5", statusColor)}/>}
            <Link href={event.href} >
              
              {
                event.compact ?
                <div className="flex gap-1">

                  <div className="w-[40px] min-w-[40px]">
                    <Image src={event.image} alt={event.title} width={300} height={300} className='overflow-hidden aspect-square object-cover rounded-md'/> 
                  </div>
                  
                  <div className="text-sm flex items-center font-bold text-gray-700 line-clamp-2 whitespace-pre-wrap ">
                    {event.title}
                  </div>
                </div>
                :
                <>
                  <div className="flex items-center text-gray-700 gap-0.5 font-bold">
                    <div>
                      {
                        event.type === "INSTAGRAM_POST" && <Camera size={20} className="pb-0.5"/>
                      }
                      {
                        event.type === "INSTAGRAM_REEL" && <Video size={20} />
                      }
                      {
                        event.type === "INSTAGRAM_STORY" && <GalleryHorizontalEnd size={18} />
                      }
                    </div>
                    <p className="text-sm">{event.title}</p>
                  </div>
                  <div className="flex gap-1">
                    <div className="min-w-[40px] w-full lg:w-[50px] lg:min-w-[50px]">
                      <Image src={event.image} alt={event.title} width={300} height={300} className='overflow-hidden aspect-square object-cover rounded-md'/> 
                    </div>

                    <div className={cn("text-gray-700 hidden lg:block", )}>
                      <p className="text-xs whitespace-pre-wrap line-clamp-3">{event.content}</p>
                    </div>
                  </div>
                </>
              }
            </Link>  
          </div>  
        )
      }
    </>
  );
};

export default CustomEvent;
