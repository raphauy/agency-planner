"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { Copy } from "lucide-react"
import useCopyToClipboard from "@/lib/useCopyToClipboard"

interface Props {
    href: string
}
export default function LinkBox({ href }: Props) {

    const [value, copy] = useCopyToClipboard()

    function copyLinkToClipboard(){   
        copy(href)    
        toast({title: "Link copiado" })
    }

    return (
        <div className="flex items-center gap-4 px-5 mt-1 border rounded-full shadow-lg dark:shadow-white">
            <Link href={href} target="_blank">
                    <Button variant="link" className="px-1">link público</Button>
            </Link>
            <Button variant="ghost" onClick={copyLinkToClipboard} className="px-2">
                <Copy size={20} />
            </Button>
        </div>
    )
}
