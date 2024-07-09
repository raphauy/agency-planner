import { CopyOptions } from "@/components/copy-options";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message, ToolInvocation } from "ai";
import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props= {
  message: Message
  userName: string
  userImage: string
  addToolResult: ({ toolCallId, result, }: { toolCallId: string; result: any }) => void
}
export default function MessageBox({ message, userName, userImage, addToolResult }: Props) {
    
    let box
  
    if (message.role === "assistant" && message.content) {
            box=(
        <div className="flex items-start gap-4 mt-4 mr-28">
            <Avatar className="w-9 h-9 border flex items-center justify-center">
            <Bot className="w-7 h-7" />
            </Avatar>
            <div className="grid gap-1">
            <div className="font-medium">Copy Lab</div>
            <div className="bg-muted p-2 rounded-md">
                <ReactMarkdown
                className="w-full mt-1 prose break-words prose-p:leading-relaxed dark:text-white"
                remarkPlugins={[remarkGfm]}
                components={{
                    // open links in new tab
                    a: (props) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                    ),
                }}
                >
                {message.content}
                </ReactMarkdown>
            </div>
            </div>
        </div>
      ) 
    }
    
    if (message.role === "user") {
        box= (
            <div className="flex items-start gap-4 justify-end mt-4 ml-28">
                <div className="grid gap-1">
                    <div className="font-medium text-right mt-1.5">{userName}</div>
                    <div className="bg-primary text-primary-foreground p-2 rounded-md">
                        {message.content}
                    </div>
                </div>
                <Avatar className="w-9 h-9 border">
                    <AvatarImage src={userImage} />
                    <AvatarFallback>{userName}</AvatarFallback>
                </Avatar>
            </div>
        )
    }

    // const toolName= message.toolInvocations ? message.toolInvocations[0]?.toolName : ""
    
    // if (message.role === "assistant" && toolName === "obtenerDocumento") {
    //     box= (
    //         <div className="text-center text-sm italic mt-7">
    //             Documento consultado: {message.content}
    //         </div>
    //     )
    // }
    // if (message.role === "assistant" && message.toolInvocations && toolName === "entregarCopys") {
    //     const toolInvocation= message.toolInvocations[0]
    //     if (!toolInvocation) return <div>No se encontró información</div>
    //     const copys= toolInvocation.args
    //     // const copys= JSON.parse(message.content)
    //     const copy1= copys.copy1
    //     const copy2= copys.copy2
    //     box= (
    //         <CopyOptions copy1={copy1} copy2={copy2} />
    //     )
    // }

    return (
        <div>
            {box}
            {message.toolInvocations?.map((toolInvocation: ToolInvocation) => {
                const toolCallId = toolInvocation.toolCallId;
                const toolName= toolInvocation.toolName
    
                // render confirmation tool (client-side tool with user interaction)
                if (toolName === 'entregarCopys') {
                    return (
                        <CopyOptions copy1={toolInvocation.args.copy1} copy2={toolInvocation.args.copy2} />
                    );
                }

                if (toolName === 'obtenerDocumento' && 'result' in toolInvocation) {
                    return (
                        <div key={toolCallId} className="text-center text-sm italic mt-7">
                            Documento consultado: {toolInvocation.result.documentName}
                        </div>    
                    );
                }

                // other tools:
                return 'result' in toolInvocation ? (
                    <div key={toolCallId} className="text-center text-sm italic mt-7">
                        Tool consultada: {toolInvocation.toolName}
                    </div>    
                ) : (
                    <div key={toolCallId} className="text-center text-sm italic mt-7">
                        Consultando ...
                    </div>
                );
            })
            }
        </div>
    )


}