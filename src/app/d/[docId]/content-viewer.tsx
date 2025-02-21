"use client"

import { useEffect, useRef, useState } from "react";
import { EditorRoot, EditorContent, type JSONContent } from "novel";
import { defaultExtensions } from "@/components/editor/extensions";
import { cn } from "@/lib/utils";

type Props = {
    content: JSONContent
    className: string
}

export default function ContentViewer({ content, className }: Props) {
    const editorContainerRef = useRef<HTMLDivElement>(null)
    const [isContentLoaded, setIsContentLoaded] = useState(false)

    useEffect(() => {
        const timeoutId = setTimeout(() => setIsContentLoaded(true), 500)
        return () => clearTimeout(timeoutId);
    }, [])
    
    useEffect(() => {
        if (editorContainerRef.current && isContentLoaded) {
            const firstElement = editorContainerRef.current.querySelector('.invisible-anchor');
            if (firstElement) {                
                firstElement.scrollIntoView();
            }
        }
    }, [editorContainerRef, isContentLoaded]);

    return (
        <div ref={editorContainerRef} className={className}>
            <div className="invisible-anchor" style={{ position: 'absolute', top: '0', left: '0', opacity: 0 }}/>

            <EditorRoot>
                <EditorContent                    
                    initialContent={content}
                    extensions={defaultExtensions}
                    editorProps={{
                        editable: () => false,
                        attributes: {
                            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
                        },
                    }}
                    immediatelyRender={false}
                />
            </EditorRoot>
        </div>
    )
}
