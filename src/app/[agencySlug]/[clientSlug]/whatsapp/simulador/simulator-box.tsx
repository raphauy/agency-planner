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
import ConversationMessageBox from "../conversaciones/conversation-message-box";
import { getConversationMessagesAction } from "./actions";

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
  const [finishedCount, setFinishedCount] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, setMessages, input, setInput, handleSubmit, status, error } = useChat({
    api: '/api/chat-simulador',
    body: {
      clientId: client.id,
      conversationId: conversationId,
    },
    onFinish: () => {onFinishActions()}
  })

  function onFinishActions() {
    setFinishedCount(finishedCount + 1)
  }

  // Función para transformar mensajes directamente al formato con la estructura mínima necesaria
  // en lugar de intentar convertir los existentes
  function createVercelAIMessages(messages: MessageDAO[]): Message[] {
    if (!Array.isArray(messages) || messages.length === 0) {
      return [];
    }
    
    return messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      role: msg.role as any,
      createdAt: new Date(msg.createdAt),
      // Propiedades esenciales para el SDK de Vercel AI
      toolInvocations: []
    }));
  }

  useEffect(() => {
    // Depuración: ver los mensajes iniciales
    console.log("initialMessages antes de transformar:", JSON.stringify(initialMessages));
    
    // Usamos la nueva función para crear mensajes compatibles
    const aiCompatibleMessages = createVercelAIMessages(initialMessages);
    
    // Depuración: ver los mensajes transformados
    console.log("aiCompatibleMessages:", JSON.stringify(aiCompatibleMessages));
    
    if (aiCompatibleMessages.length > 0) {
      setMessages(aiCompatibleMessages);
      setConversationId(initialMessages[0].conversationId);
    } else {
      setMessages([]);
      setConversationId("new");
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

  useEffect(() => {
    if (conversationId) {
      console.log("getting conversation messages")
      getConversationMessagesAction(conversationId)
      .then(messages => {
        // Depuración: ver los mensajes de la BD
        console.log("mensajes de la BD:", JSON.stringify(messages));
        
        // Usamos la nueva función para crear mensajes compatibles
        const aiCompatibleMessages = createVercelAIMessages(messages);
        
        // Depuración: ver los mensajes transformados
        console.log("aiCompatibleMessages:", JSON.stringify(aiCompatibleMessages));
        
        setMessages(aiCompatibleMessages);
      })
      .catch(err => {
        console.error("Error al obtener mensajes de conversación:", err);
        setMessages([]);
      })
    }
  }, [conversationId, setMessages, finishedCount])

  // Scroll al último mensaje cuando se añade uno nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const disabled = status === "streaming" || input.length === 0

  return (
    <main className="flex flex-col items-center justify-between w-full pb-40">

      <ChatHeader email={userEmail} date={messages[messages.length -1]?.createdAt} conversationId={conversationId} isAdmin={isAdmin} />

      <div className="w-full max-w-3xl mt-4 space-y-2">
        {messages.length > 0 ? (
          messages.map((message, i) => {
            return(
              <ConversationMessageBox key={i} message={message} userName={userEmail} />            
            )})
        ) : client?.name && (
          <InitialBox clientName={client.name} />
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <p className="mt-10 text-base text-center text-red-500">{error?.message}</p>}

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
            disabled={error?.message !== undefined}
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
              status === "streaming" ? 
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
