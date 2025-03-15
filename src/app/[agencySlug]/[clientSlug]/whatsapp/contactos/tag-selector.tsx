'use client';

import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

type Props = {
  actualTags: string[]
  allTags: string[]
  baseUrl: string
}
export default function TagSelector({ actualTags, allTags, baseUrl }: Props) {
  const [contactTags, setContactTags] = React.useState<Option[]>([])

  const searchParams= useSearchParams()
  const router= useRouter()

  useEffect(() => {
    if (actualTags.length <= 0) {
      return
    }
    setContactTags(actualTags.map((tag) => ({ label: tag, value: tag})))
  }, [actualTags])


  function updateContactTags(tags: Option[]) {
    const isAdded = tags.length > contactTags.length
    setContactTags(tags)
    setTags(tags.map((tag) => tag.value))
  }

  function setTags(tags: string[]) {
    const allParams = searchParams.toString()
    // Remove tags params along with the leading ampersand if necessary
    let newParams= allParams.replace(/([&]?)(tags)=[^&]+/g, "")
    newParams= newParams.startsWith("&") ? newParams.slice(1) : newParams
    const restOfTheParams= newParams ? `&${newParams}` : ""
    const tagsParam= tags.length > 0 ? `tags=${tags.join(",")}` : ""
    const newUrl= `${baseUrl}?${tagsParam}${restOfTheParams}`
    router.push(newUrl)
  }

  return (
    <div className="flex w-full flex-col gap-5">     
      <MultipleSelector        
        value={contactTags}
        onChange={updateContactTags}
        defaultOptions={allTags.map((tag) => ({ label: tag, value: tag }))}
        placeholder="Filtrar por etiqueta"
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            no hay etiquetas.
          </p>
        }
      />  
    </div>
  );
};

