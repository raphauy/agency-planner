"use client"

import { useState } from "react"
import IgCarousel from "./ig-carousel"

type Props = {
  initialImages: string[] // initialImages ahora es un array de strings
}

export default function IgPost({ initialImages }: Props) {
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

        <IgCarousel initialImages={images} addImage={addImage} removeImage={removeImage} />

        {images.length > 0 &&
          <p>Images count: {images.length}</p>
        }
    </div>
  )
}
