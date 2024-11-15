"use client"

import { useState } from "react"
import IgCarousel from "./ig-carousel"

type Props = {
  initialImages: string[]
  cloudinaryPreset: string
  cloudName: string
  clientSlug: string
}

export default function IgPost({ initialImages, cloudinaryPreset, cloudName, clientSlug }: Props) {
  // Ahora images es un array de strings (URLs)
  const [images, setImages] = useState<string[]>(initialImages)

  function addImage(image: string) {
    setImages((prevImages) => [...prevImages, image]);
  }

  function removeImage(imageUrl: string) {
    setImages((prevImages) => prevImages.filter((image) => image !== imageUrl));
  }

  return (
    <div className="border p-4 min-w-[500px] bg-white rounded-lg max-w-[550px]">

        <IgCarousel initialImages={images} addImage={addImage} removeImage={removeImage} cloudinaryPreset={cloudinaryPreset} cloudName={cloudName} clientSlug={clientSlug} />

        {images.length > 0 &&
          <p>Images count: {images.length}</p>
        }
    </div>
  )
}
