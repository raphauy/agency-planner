"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { Trash2, Upload } from "lucide-react"
import { CldUploadButton } from 'next-cloudinary'
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

const CLOUDINARY_PRESET= process.env.NEXT_PUBLIC_CLOUDINARY_PRESET

type Props = {
  initialImages: string[]
  addImage?: (imageUrl: string) => void
  removeImage?: (imageUrl: string) => void
}
export default function IgCarousel({ initialImages, addImage, removeImage }: Props) {

  // string whith images urls separated by comma
  const [images, setImages] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showPlaceholder, setShowPlaceholder] = useState(true)

  useEffect(() => {
    if (initialImages.length > 0) {
      setImages(initialImages)
      setShowPlaceholder(false)
    } else {
      setShowPlaceholder(true)
      setImages([])
    }
  }, [initialImages])
  

  function handleUpload(result: any) {    
    const img: string = result.info.secure_url
    addImage && addImage(img)
  }

  function handleRemoveImage(image: string) {
    if (!removeImage) return
    
    removeImage(image)
    if (images.length === 1) {
      setShowPlaceholder(false)
      setImages([])
    }
  }

  return (
    <div className="w-full flex flex-col items-center mt-4">
      { !showPlaceholder &&
        <Carousel className="w-full mb-2">
          <CarouselContent>
            { 
              images.map((image, index) => {
                const isImage= image.includes(".jpg") || image.includes(".png") || image.includes(".jpeg")
                const isVideo= image.includes(".mp4") || image.includes(".mov") || image.includes(".webm")
                if (!isImage && !isVideo) return null

                return(
                  <CarouselItem key={image} className="flex items-center relative">
                    {
                      isImage &&
                        <Image src={image} alt="carousel image" width={600} height={600} 
                          className="object-cover w-full rounded-lg"
                        />
                    }
                    {
                      isVideo &&
                      <video src={image.replace(".mov", ".mp4")} className="object-cover w-full rounded-lg" controls />
                    }                    {
                      removeImage &&
                        <div className="absolute bottom-3 right-3">
                          <Trash2 
                            className="w-6 h-6 p-1 bg-gray-200 cursor-pointer border border-gray-500 rounded-md hover:bg-gray-300" 
                            onClick={() => handleRemoveImage(image)
                          } />
                        </div>
                    }
                  </CarouselItem>
                )}
            )}
          </CarouselContent>
          {
            images.length > 1 &&
            <>
              <div onClick={() => setSelectedIndex(selectedIndex - 1)}>
                <CarouselPrevious className="left-4"/>
              </div>
              <div onClick={() => setSelectedIndex(selectedIndex + 1)}>
                <CarouselNext className="right-4"  />
              </div>
              <div className="absolute rounded-full bottom-3 w-full flex justify-center gap-1">
                {
                  images.map((_, index) => (
                    <div key={index} 
                      className={cn("h-2 w-2 rounded-full",index === selectedIndex ? "bg-blue-400" : "bg-gray-400")}
                    />
                  ))
                }
              </div>
            </>
          }
        </Carousel>
        
      }
      {
        addImage ?
          <CldUploadButton
          className="flex flex-col items-center w-full mt-1 gap-2"
          options={ { maxFiles: 1, tags: ["cambiar"], folder: "agency/dev" } }
          onSuccess={handleUpload}
          uploadPreset={CLOUDINARY_PRESET}
        >
          <div>
          {
            showPlaceholder &&
            <Image src="/image-placeholder.png" alt="carousel image" width={600} height={600} 
              className="object-cover w-full rounded-lg"
            />
          }
          </div>

          <Upload className='w-32 h-10 p-2 bg-gray-200 border border-gray-500 rounded-md hover:bg-gray-300' />
        </CldUploadButton>
        :
        <div>
          {
            showPlaceholder &&
            <Image src="/image-placeholder.png" alt="carousel image" width={600} height={600} 
              className="object-cover w-full rounded-lg"
            />
          }
        </div>
      }

    </div>
)
}
