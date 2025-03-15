'use client';

import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import React, { useEffect } from 'react';

type Props = {
  actualTags: string[]
  allTags: string[]
  onChange: (tags: string[], ) => Promise<boolean>
  placeholder: string
}
export default function TagSelector({ actualTags, allTags, onChange, placeholder }: Props) {
  const [contactTags, setContactTags] = React.useState<Option[]>([])

  useEffect(() => {
    if (actualTags.length <= 0) {
      return
    }
    setContactTags(actualTags.map((tag) => ({ label: tag, value: tag})))
  }, [actualTags])


  function updateContactTags(tags: Option[]) {
    const isAdded = tags.length > contactTags.length
    setContactTags(tags)
    onChange(tags.map((tag) => tag.value))

  }

  return (
    <div className="flex w-full flex-col gap-5">     
      <MultipleSelector
        value={contactTags}
        onChange={updateContactTags}
        defaultOptions={allTags.map((tag) => ({ label: tag, value: tag }))}
        placeholder={placeholder}
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            no hay etiquetas.
          </p>
        }
      />  
    </div>
  );
};

