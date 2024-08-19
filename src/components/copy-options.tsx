"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useCopyToClipboard from "@/lib/useCopyToClipboard";
import { toast } from "./ui/use-toast";
import { Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  copy1: string
  copy2: string
};

export function CopyOptions({ copy1, copy2 }: Props) {
  const [value, copy] = useCopyToClipboard()

  function copy1ToClipboard(){

      copy(copy1)
      
      toast({ title: "Opción 1 copiada 👌"} )
  }

  function copy2ToClipboard(){

    copy(copy2)
    
    toast({ title: "Opción 2 copiada 👌"} )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 mt-10">
      <Card className="flex flex-col justify-between h-full">
        <CardHeader>
          <CardTitle>Opción 1</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between gap-4 flex-grow">
          <div className="flex-grow">
            <ReactMarkdown
              className="w-full mt-1 prose break-words prose-p:leading-relaxed text-muted-foreground"
              remarkPlugins={[remarkGfm]}
              components={{
                  // open links in new tab
                  a: (props) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
              }}
              >
              {copy1}
            </ReactMarkdown>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex-1 justify-center gap-2"
              onClick={copy1ToClipboard}
            >
              <Copy /> Copiar texto
            </Button>
            {/* <Button variant="outline" className="flex-1 justify-center">Crear Publicación</Button> */}
          </div>
        </CardContent>
      </Card>
      <Card className="flex flex-col justify-between h-full">
        <CardHeader>
          <CardTitle>Opción 2</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between gap-4 flex-grow">
          <div className="flex-grow">
            <ReactMarkdown
                className="w-full mt-1 prose break-words prose-p:leading-relaxed text-muted-foreground"
                remarkPlugins={[remarkGfm]}
                components={{
                    // open links in new tab
                    a: (props) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                    ),
                }}
                >
                {copy2}
              </ReactMarkdown>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex-1 justify-center gap-2"
              onClick={copy2ToClipboard}
            >
              <Copy /> Copiar texto
            </Button>
            {/* <Button variant="outline" className="flex-1 justify-center">Crear Publicación</Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
