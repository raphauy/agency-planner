"use client"

import { useAgencySlug } from "@/app/admin/users/use-roles"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader, Pencil, Upload } from "lucide-react"
import { CldUploadButton } from "next-cloudinary"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

const CLOUDINARY_PRESET= process.env.NEXT_PUBLIC_CLOUDINARY_PRESET

type Props= {
  id: string
  initialImage: string
  update: (id: string, newImage: string) => Promise<boolean>
}

export function ImageForm({ id, initialImage, update }: Props) {

  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(initialImage)

  const [showPlaceholder, setShowPlaceholder] = useState(initialImage === "")

  async function handleUpload(result: any) {    
    const img: string = result.info.secure_url
    setImage(img)
    setShowPlaceholder(false)
    setLoading(true)
    const ok= await update(id, img)
    
    if (ok) {
      toast({title: "Imagen cambiada" })
    } else {      
      toast({title: "Error al cambiar la imagen", variant: "destructive"})
    }

    setLoading(false)
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-black">
      <div className="font-medium flex flex-col">
        Imagen del cliente:
        <CldUploadButton
          className="flex flex-col items-center w-full mt-1 gap-2"
          options={ { maxFiles: 1, tags: ["cambiar"], folder: "agency/dev" } }
          onSuccess={handleUpload}
          uploadPreset={CLOUDINARY_PRESET}
        >
          <div>
          {
            showPlaceholder ?
            <Image src="/image-placeholder.png" alt="imagen del cliente" width={600} height={600} 
              className="object-cover w-full rounded-lg"/> 
            :
            <Image src={image} alt="imagen del cliente" width={600} height={600} 
              className="object-cover w-full rounded-lg"/>
          }
          </div>
        </CldUploadButton>
    </div>
    </div>
  )
}