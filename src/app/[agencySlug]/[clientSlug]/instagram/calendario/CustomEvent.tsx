import Link from "next/link";

import { isBefore } from "date-fns";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface Event {
  fechaImportante: string;
  title: string;
  content: string;
  start: Date;
  end: Date;
  image: string;
  color: string;
  href: string;
  status: string;
  compact?: boolean;
}

interface CustomEventProps {
  event: Event
}

const CustomEvent: React.FC<CustomEventProps> = ({ event }) => {

  const fechasImportantes: string[]= event.fechaImportante.split(",")

  const statusColor= event.status === "Aprobado" ? "text-green-500" : event.status === "Revisado" ? "text-orange-500" : event.status === "Programado" ? "text-sky-500" : event.status === "Publicado" ? "text-yellow-500" : "text-gray-500"
  // pastDate is true if the event is in the past, use date-fns to compare dates
  const pastDate= isBefore(event.start, new Date())

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
                  <p className="flex items-center text-sm font-bold text-gray-700">{event.title}</p>
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
