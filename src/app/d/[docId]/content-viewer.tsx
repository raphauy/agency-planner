"use client"

import { useEffect, useRef, useState } from "react";
import {
  EditorRoot,
  EditorContent,
  type JSONContent,
} from "novel";
import { defaultExtensions } from "@/components/editor/extensions";

type Props = {
    content: JSONContent
}

export default function ContentViewer({ content }: Props) {
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
        <div ref={editorContainerRef} className="flex justify-center h-full border rounded-b-lg">
            <div className="invisible-anchor" style={{ position: 'absolute', top: '0', left: '0', opacity: 0 }}/>

            <EditorRoot>
                <EditorContent
                    className="w-full h-full rounded-t-none rounded-b-md border p-4 bg-white dark:bg-black dark:text-white"
                    initialContent={content}
                    extensions={defaultExtensions}
                    editorProps={{
                        editable: () => false,
                        attributes: {
                            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
                        },
                    }}
                />
            </EditorRoot>
        </div>
    )
}
