"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import useCopyToClipboard from "@/lib/useCopyToClipboard"
import { Copy } from "lucide-react"

type Propx= {
    text: string
}
export default function CopyBox({ text }: Propx) {

    const [value, copy] = useCopyToClipboard()

    function copyToClipboard(){

        copy(text)
        
        toast({ title: "Texto copiado 👌"} )
    }
      
    return (
        <Button variant="ghost" onClick={copyToClipboard} className="px-2">
            <Copy />
        </Button>
    )
}
