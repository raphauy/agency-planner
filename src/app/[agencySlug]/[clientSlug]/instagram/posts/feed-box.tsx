"use client"

import { cn } from '@/lib/utils'
import { PublicationDAO } from '@/services/publication-services'
import { CloudinaryImage } from '@cloudinary/url-gen'
import { fill } from '@cloudinary/url-gen/actions/resize'
import { Calendar, Camera, Circle, Loader } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
// import { AiOutlineCalendar, AiOutlineCamera } from 'react-icons/ai'
// import { GrStatusGoodSmall } from 'react-icons/gr'

type Props= {
    post: PublicationDAO
}
export default function FeedBox({ post }: Props) {
  const [clicked, setClicked] = useState(false)
  const params= useParams()
  const agencySlug= params.agencySlug as string
  const clientSlug= params.clientSlug as string

  function handleClick() {
    setClicked(true)
    setTimeout(() => {
      setClicked(false)
    }, 1000);
  }

  if (clicked)
    return <div className='flex items-center justify-center w-full h-full'><Loader className='animate-spin' /></div>
  
  const portada= post.images ? post.images.split(",")[0] : "/image-placeholder.png"
  const images= post.images ? post.images.split(",") : ["/image-placeholder.png"]

  const statusColor= post.status === "APROBADO" ? "text-green-500" : post.status === "REVISADO" ? "text-orange-500" : post.status === "PROGRAMADO" ? "text-sky-500" : post.status === "PUBLICADO" ? "text-yellow-500" : "text-gray-500"
  const pastDate= post.createdAt && post.createdAt < new Date()
  const show= !pastDate && post.status !== "APROBADO"

  return (
    <>
      <div className="min-h-[100px] max-w-[155px]">
          <div onClick={handleClick} className="relative h-full overflow-hidden transition bg-white border border-gray-300 cursor-pointer hover:scale-110">
            {!post.publicationDate && <Calendar className="absolute top-0 right-0 text-white bg-black rounded-md bg-opacity-30" size={23}/>}

            {show && <Circle className={cn("absolute bottom-0 right-0 text-orange-500 rounded-md", statusColor)} size={20}/>}

            {images.length > 1 && <div className="absolute top-0 left-0 flex gap-1 text-white bg-black rounded-md bg-opacity-30"><Camera  size={23}/>{images.length}</div>}
            
            <Link href={`/${agencySlug}/${clientSlug}/instagram/posts?post=${post.id}`}>
              <Image src={portada} alt={post.title} width={200} height={200} className='overflow-hidden aspect-square object-cover'/>
            </Link>
          </div>
      </div>
    </>
    
  )
}
