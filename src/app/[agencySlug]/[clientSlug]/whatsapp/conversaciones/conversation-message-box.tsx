import { Message } from "ai";
import { cn, formatWhatsAppStyle, getRoleColor } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Terminal, Bot } from "lucide-react";
import { MessageDAO } from "@/services/message-services";
import FunctionData from "../simulador/function-data";
import CodeBlock from "@/components/code-block";

type Props = {
    message: MessageDAO
}
export default function ConversationMessageBox({ message }: Props) {


  if (message.role === "assistant" && !message.content) return null

  const isUser = message.role === 'user';
  if (isUser) return <UserRowMessage key={message.id} message={message} />

  const isAssistant = message.role === 'assistant';
  if (isAssistant) return <AssistantRowMessage key={message.id} message={message} />

  const isData = message.role === 'data' || message.role === 'function';
  if (isData) return <DataRowMessage key={message.id} message={message} />

  return <div>Unknown message role: {message.role}</div>
}

function UserRowMessage({message}: {message: MessageDAO}) {
  const isUser= message.role === 'user'
  if (!isUser) return null

  const userName= message.name || "Usuario"
  const formattedDate= formatWhatsAppStyle(message.createdAt)

  return (
    <div key={message.id} className="flex justify-end">
      <div className={`max-w-[70%] min-w-[300px] rounded-lg p-3 mt-1 bg-emerald-100 dark:bg-emerald-900 border-l-4 border-emerald-500`}>
        <div className={`text-xs font-bold text-emerald-700 dark:text-emerald-400`}>
          {userName}:
        </div>
        
        <div className="whitespace-pre-wrap text-sm mt-1 text-zinc-800 dark:text-zinc-200">
          {message.content}
        </div>
        
        <div className="text-xs text-right mt-1 text-zinc-500">
          {formattedDate}
        </div>
      </div>
    </div>
  )
}

function AssistantRowMessage({message}: {message: MessageDAO}) {
  const isAssistant= message.role === 'assistant'
  if (!isAssistant) return null

  const content= message.content
  if (content === "<SILENCIO>") return null

  const formattedDate= formatWhatsAppStyle(message.createdAt)

  return (
    <div key={message.id} className="flex justify-start">
      <div className={`max-w-[70%] min-w-[300px] rounded-lg p-3 bg-white dark:bg-zinc-800 border-l-4 border-blue-500`}>
        {/* Nombre del remitente */}
        <div className={`text-xs font-bold text-blue-600 dark:text-blue-400`}>
          Asistente:
        </div>
        
        {/* Contenido del mensaje */}
        <div className="whitespace-pre-wrap text-sm mt-1 text-zinc-800 dark:text-zinc-200">
          {content}
        </div>
        
        {/* Hora del mensaje (simulada) */}
        <div className="text-xs text-right mt-1 text-zinc-500">
          {formattedDate}
        </div>
      </div>
    </div>
  )
}

function DataRowMessage({message}: {message: MessageDAO}) {
  const isData= message.role === 'data' || message.role === 'function'
  if (!isData) return null

  if (!message.toolInvocations) return <div>No tool invocations</div>

  const formattedDate= formatWhatsAppStyle(message.createdAt)

  return (
    <div key={message.id} className="flex justify-start">
      <div className={`rounded-lg w-full`}>
        
        <FunctionData toolResultStr={message.toolInvocations.toString()} />

        {/* Hora del mensaje (simulada) */}
        <div className="text-xs text-right mt-1 text-zinc-500">
          {formattedDate}
        </div>
      </div>
    </div>
  )
}