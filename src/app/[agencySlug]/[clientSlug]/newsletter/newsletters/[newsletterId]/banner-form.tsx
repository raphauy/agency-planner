"use client"

import { toast } from "@/components/ui/use-toast"
import { Loader, Upload } from "lucide-react"
import { CldUploadButton } from "next-cloudinary"
import { useState } from "react"
import { updateBannerAction } from "../newsletter-actions"
import { Button } from "@/components/ui/button"

type Props= {
  newsletterId: string
  clientSlug: string
  cloudinaryPreset: string
}

export function BannerForm({ newsletterId, clientSlug, cloudinaryPreset }: Props) {
  const [loading, setLoading] = useState(false)

  function handleUpload(result: any) {
    const img: string = result.info.secure_url
    console.log(img)
    
    setLoading(true)
    updateBannerAction(newsletterId, img)
    .then((data) => {
      if (data) {
        toast({title: "Banner updated" })
      }
    })
    .catch((error) => {
      toast({title: "Error", description: error.message, variant: "destructive"})
    })
    .finally(() => {
      setLoading(false)
    })
  }

  return (
    <div>
      <CldUploadButton
        className="flex flex-col items-center w-full mt-1 gap-2"
        options={ { maxFiles: 1, tags: [`${clientSlug}`,"banner"], folder: `agency-planner/${clientSlug}` } }
        onSuccess={handleUpload}
        uploadPreset={cloudinaryPreset}
      >
        
        <Button variant="link" className="self-end gap-2 p-1">
        {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        <p>Cambiar banner</p>
        </Button>
      </CldUploadButton>
    </div>
)
}

