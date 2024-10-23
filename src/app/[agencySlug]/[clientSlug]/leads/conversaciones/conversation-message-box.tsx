import { Message } from "ai";
import { cn, getRoleColor } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Terminal, Bot } from "lucide-react";
import { MessageDAO } from "@/services/message-services";
import FunctionData from "../simulador/function-data";

type Props = {
    message: MessageDAO
}
export default function ConversationMessageBox({ message }: Props) {


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
          <div className="w-full">
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

            { message.tokens > 0 &&
              <p className="text-right text-sm">{(message.tokens/1000).toFixed(2)} créditos</p>
            }
          </div>
        </div>                         

      </div>
    </div>
  )
}
