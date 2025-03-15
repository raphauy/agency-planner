import { Message } from "ai";
import { cn, getRoleColor } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Terminal, Bot } from "lucide-react";
import FunctionData from "./function-data";

type Props = {
    message: Message
}
export default function MessageBox({ message }: Props) {


  if (message.role === "assistant" && !message.content) return null

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex w-full px-1 items-center justify-center border-gray-200 py-4",
          message.role === "user" ? "bg-gray-100 dark:bg-gray-800" : "bg-background",
        )}
      >
        <div className="flex items-start w-full max-w-screen-md px-5 space-x-4 sm:px-0">
          {
            <div className={cn("p-1.5 text-white", getRoleColor(message.role))} >
              {message.role === "user" && message.content ? (
              <User width={20} />
              ) : message.role === "system" && message.content ? (
              <Terminal width={20} />
              ) : message.role === "function" && message.toolInvocations ? (
              <Terminal width={20} />
              ) : message.role === "assistant" && message.content ? (
              <Bot width={20} />
              ) : 
              <></>
              }

            </div>
          }
          {
            (message.role === "user" || message.role === "assistant") && message.content &&
            <ReactMarkdown
              className="w-full mt-1 prose break-words prose-p:leading-relaxed dark:prose-invert"
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
          }
          {
            message.role === "function" && message.toolInvocations &&
            <FunctionData toolResultStr={message.toolInvocations.toString()} />
          }

        </div>                         

      </div>
    </div>
  )
}

export function InitialBox({ clientName }: { clientName: string }) {
    return (
      <div className="max-w-screen-md mx-5 border rounded-md border-gray-200sm:mx-0 sm:w-full">
        <div className="flex flex-col space-y-4 p-7 sm:p-10">
          <h1 className="text-lg font-semibold">
            Bienvenido al asistente de {clientName}!
          </h1>
          <p className="text-gray-500">
            Este es un simulador de conversaciones.
          </p>
        </div>
      </div>
    )
}

