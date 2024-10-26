"use client";

import { cn } from "@/lib/utils";
import { ClientDAO } from "@/services/client-services";
import { Message, useChat } from "ai/react";
import { toZonedTime } from "date-fns-tz";
import { Bot, Loader, SendIcon, Terminal, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import Textarea from "react-textarea-autosize";
import remarkGfm from "remark-gfm";
import MessageBox, { InitialBox } from "./message-box";
import ChatHeader from "./chat-header";
import { MessageDAO } from "@/services/message-services";
import { getActiveConversationIdAction } from "../conversaciones/actions";

type Props = {
  client: ClientDAO
  userEmail: string
  isAdmin?: boolean
  initialMessages: MessageDAO[]
}
export default function SimulatorBox({ client, userEmail, isAdmin, initialMessages }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [conversationId, setConversationId] = useState("")  
  const [loading, setLoading] = useState(false)
  const [showSystem, setShowSystem] = useState(false)
  const [finishedCount, setFinishedCount] = useState(0)

  const router= useRouter()

  const { messages, setMessages, input, setInput, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat-lead',
    body: {
      clientId: client.id,
      conversationId: conversationId,
    },
    onFinish: () => {onFinishActions()}
  })

  function onFinishActions() {
    setFinishedCount(finishedCount + 1)
  }

  useEffect(() => {
    setMessages(initialMessages as Message[])
    if (initialMessages.length > 0) {
      setConversationId(initialMessages[0].conversationId)
    } else {
      setConversationId("new")
    }
  }, [initialMessages, setMessages])

  useEffect(() => {
    if (conversationId === "new" && finishedCount > 0) {
      console.log("getting active conversation id")
      getActiveConversationIdAction(userEmail, client.id)
      .then(id => {
        if (id) setConversationId(id)
      })  
    }
  }, [client.id, userEmail, conversationId, finishedCount])

  // useEffect(() => {
  //   setLoading(true)
    
  //   getDataClientBySlug(slug)
  //   .then(client => {
  //     if (client) {
  //       setClient(client)
  //       client.promptTokensPrice && setPromptTokensPrice(client.promptTokensPrice)
  //       client.completionTokensPrice && setCompletionTokensPrice(client.completionTokensPrice)
  //     }
  //   })
  //   .catch(error => console.log(error))

  //   // empty messages
  //   setMessages([]) 
  //   setLoading(false)   
  // }, [slug, setMessages, router, searchParams])


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

  //       const messages= showSystem ? res : res.filter(message => message.role !== "system")
  //       // @ts-ignore        
  //       setMessages(messages)
  //       setConversationId(res[0].conversationId)
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  //   }
  //   setLoading(false)
  // }, [session, setMessages, client, showSystem, finishedCount])


  const disabled = isLoading || input.length === 0

  return (
    <main className="flex flex-col items-center justify-between w-full pb-40">

      <ChatHeader email={userEmail} date={messages[messages.length -1]?.createdAt} conversationId={conversationId} isAdmin={isAdmin} />

      <div className="w-full max-w-3xl mt-5">
        {messages.length > 0 ? (
          messages.map((message, i) => {
            return(
              <MessageBox key={i} message={message} />            
          )})
        ) : client?.name && (
          <InitialBox clientName={client.name} />
        )}
      </div>

      {error && <p className="mt-10 text-base text-center text-red-500">Ocurrió un error</p>}

      <div className="fixed bottom-0 flex flex-col items-center w-full max-w-[350px] sm:max-w-[400px] md:max-w-[550px] lg:max-w-screen-md sm:px-0">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative w-full px-4 pt-3 pb-2 border border-gray-200 shadow-lg rounded-xl sm:pb-3 sm:pt-4 bg-background"
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
            className="w-full pr-10 focus:outline-none bg-background"
          />
          <button
            className={cn(
              "absolute inset-y-0 right-4 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all bg-background",
              disabled
                ? "cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600",
            )}
            disabled={disabled}
          >
            {
              isLoading ? 
                <Loader className="animate-spin" />
                : 
                <SendIcon className={cn("h-4 w-4", input.length === 0 ? "text-gray-300" : "text-white",)} />
            }
          </button>
        </form>

        <div className="w-full h-10 bg-slate-50 dark:bg-black" />

      </div>

    </main>
  );
}
