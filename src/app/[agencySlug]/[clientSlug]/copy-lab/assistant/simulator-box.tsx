"use client";

import { getClientDAOBySlugAction } from "@/app/[agencySlug]/clients/client-actions";
import { getFormat } from "@/lib/utils";
import { ClientDAO } from "@/services/client-services";
import { useChat } from "ai/react";
import clsx from "clsx";
import { Bot, Loader, SendIcon, Terminal, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import Textarea from "react-textarea-autosize";
import remarkGfm from "remark-gfm";

type Props= {
  clientSlug: string
  conversationId: string
}
export default function SimulatorBox({ clientSlug, conversationId }: Props) {
  
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [client, setClient] = useState<ClientDAO | null>(null)
  const [userEmail, setUserEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [finishedCount, setFinishedCount] = useState(0)

  const session= useSession()
  const isAdmin= session?.data?.user?.role === "ADMIN"
  const router= useRouter()

  const { messages, setMessages, input, setInput, handleSubmit, isLoading, error } = useChat({
    body: {
      conversationId,
      clientSlug
    },
    onFinish: () => {onFinishActions()}
  })

  function onFinishActions() {
    setFinishedCount((prev) => prev + 1)
  }

  useEffect(() => {
    setLoading(true)
    
    getClientDAOBySlugAction(clientSlug)
    .then(client => {
      if (client) {
        setClient(client)
      }
    })
    .catch(error => console.log(error))

    // empty messages
    setMessages([]) 
    setLoading(false)   
  }, [clientSlug])


  // useEffect(() => {
  //   if (!client) return

  //   setLoading(true)
  //   const email= session?.data?.user?.email
  //   setUserEmail(email as string)
  //   console.log("updating messages")
    
  //   if (email) {
  //     getActiveMessagesAction(email, client.id)
  //     .then((res) => {
  //       if(!res) return

  //       setMessages(messages)
  //       setConversationId(res[0].conversationId)
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  //   }
  //   setLoading(false)
  // }, [session, setMessages, client, finishedCount])



  const disabled = isLoading || input.length === 0

  return (
    <main className="flex flex-col items-center justify-between w-full pb-40">
      
      <div>
        {
          loading ? 
            <Loader className="animate-spin" /> :         
            <p className="text-lg font-bold text-center">{userEmail} {messages.length > 0 && "(" + getFormat(messages[messages.length -1].createdAt || new Date()) + ")"}</p>
        }
      </div>

      <div className="w-full max-w-3xl mt-5 ">
        {messages.length > 0 ? (
          messages.map((message, i) => (
            <div
              key={i}
              className={clsx(
                "flex w-full px-1 items-center justify-center border-b border-gray-200 py-4",
                message.role === "user" ? "bg-gray-100" : "bg-white",
              )}
            >
              <div className="flex items-start w-full max-w-screen-md px-5 space-x-4 sm:px-0">
                <div
                  className={clsx(
                    "p-1.5 text-white",
                    (message.role === "assistant" || message.role === "function") ? "bg-green-500" : message.role === "system" ? "bg-blue-500" : "bg-black",
                  )}
                >
                {message.role === "user" ? (
                <User width={20} />
                ) : message.role === "system" || message.role === "function" ? (
                <Terminal width={20} />
                ) : (
                <Bot width={20} />
                )
                }

                </div>
                {message.role !== "system" &&
                  <ReactMarkdown
                    className="w-full mt-1 prose break-words prose-p:leading-relaxed"
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
              </div>                         
              {
                // @ts-ignore
                message.promptTokens > 0 && (
                  <div className="grid p-2 text-right border rounded-md">
                    {/** @ts-ignore */}
                    <p className="whitespace-nowrap">{Intl.NumberFormat("es-UY").format(message.promptTokens)} pt</p>
                    {/** @ts-ignore */}
                    <p>{Intl.NumberFormat("es-UY").format(message.completionTokens)} ct</p>
                  </div>
                )
              }
            </div>
          ))
        ) : client?.name && (
          <div className="max-w-screen-md mx-5 border rounded-md border-gray-200sm:mx-0 sm:w-full">
            <div className="flex flex-col space-y-4 p-7 sm:p-10">
              <h1 className="text-lg font-semibold text-black">
                Bienvenido al asistente de {client?.name}!
              </h1>
              <p className="text-gray-500">
                Aquí podrás generar los mejores copys :-)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-10 text-base text-center text-red-500">{error.message}</p>}

      <div className="fixed mb-12 bottom-0 flex flex-col items-center w-full p-5 pb-3 space-y-3 max-w-[350px] sm:max-w-[400px] md:max-w-[550px] lg:max-w-screen-md bg-gradient-to-b from-transparent via-gray-100 to-gray-100 sm:px-0">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative w-full px-4 pt-3 pb-2 bg-white border border-gray-200 shadow-lg rounded-xl sm:pb-3 sm:pt-4"
        >
          <Textarea
            ref={inputRef}
            tabIndex={0}
            required
            rows={1}
            autoFocus
            placeholder="Escribe aquí"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                formRef.current?.requestSubmit();
                e.preventDefault();
              }
            }}
            spellCheck={false}
            className="w-full pr-10 focus:outline-none"
          />
          <button
            className={clsx(
              "absolute inset-y-0 right-4 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
              disabled
                ? "cursor-not-allowed bg-white"
                : "bg-green-500 hover:bg-green-600",
            )}
            disabled={disabled}
          >
            {isLoading ? (
              <Loader className="animate-spin" />
            ) : (
              <SendIcon
                className={clsx(
                  "h-4 w-4",
                  input.length === 0 ? "text-gray-300" : "text-white",
                )}
              />
            )}
          </button>
        </form>

      </div>

    </main>
  );
}
