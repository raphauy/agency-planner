"use client"

import React, { useEffect, useState } from 'react';
import { Tag, TagInput } from 'emblor';
import { toast } from '@/components/ui/use-toast';
import { Loader } from 'lucide-react';
import { addTagToRepositoryAction, removeTagFromRepositoryAction } from '../repository-actions';

type Props = {
    repoId: string
    initialTags: string[]
}
export default function TagInputBox({ repoId, initialTags }: Props) {
    const [loading, setLoading] = useState(false)
    const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null)
    const [tags, setTags] = useState<Tag[]>(initialTags.map(tag => ({id: tag, text: tag})))

    function onTagAdd(tag: string) {
        setLoading(true)
        addTagToRepositoryAction(repoId, tag)
        .then(updated => {
            if (updated) {
                toast({title: "Etiqueta agregada"})
            } else {
                toast({title: "Error al agregar etiqueta", variant: "destructive"})
            }
        })
        .catch(error => {
            toast({title: "Error al agregar etiqueta", variant: "destructive"})
        })
        .finally(() => {
            setLoading(false)
        })
    }

    function onTagRemove(tag: string) {
        setLoading(true)
        removeTagFromRepositoryAction(repoId, tag)
        .then(updated => {
            if (updated) {
                toast({title: "Etiqueta eliminada"})
            } else {
                toast({title: "Error al eliminar etiqueta", variant: "destructive"})
            }
        })
        .catch(error => {
            toast({title: "Error al eliminar etiqueta", variant: "destructive"})
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <div>
            <div className="flex items-center gap-x-2 border-b pb-2 pl-2">                
                <p className="font-bold">Etiquetas:</p>
                { loading && <Loader className="animate-spin" /> }
            </div>

            <div className="mt-2 bg-background p-2 rounded-md">
                <TagInput 
                    loa
                    tags={tags}
                    setTags={setTags}            
                    placeholder="Agregar etiqueta"
                    activeTagIndex={activeTagIndex}
                    setActiveTagIndex={setActiveTagIndex}
                    inlineTags={false}
                    styleClasses = {
                        {
                        input: 'w-full',
                        }
                    }
                    onTagAdd={onTagAdd}
                    onTagRemove={onTagRemove}
                />                
            </div>

        </div>
    );
};
