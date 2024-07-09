"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ArrowDownIcon, ArrowUpIcon, Bot, MoveVertical, MoveVerticalIcon, PlusCircle, PlusCircleIcon } from "lucide-react"
import { useChat, Message } from "ai/react"
import { ConversationDAO } from "@/services/conversation-services"
import { useEffect, useRef, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import SuggestedMessages from "./suggested-messages"
import Textarea from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ScrollArea } from "@/components/ui/scroll-area"
import MessageBox from "./message-box"
import { MessageDAO } from "@/services/message-services"
import { TitleDialog } from "./_conversations/conversation-dialogs"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import { getTotalTokensActions } from "./_conversations/conversation-actions"

type Props= {
  clientSlug: string
  conversation: ConversationDAO
}

export function ChatComponent({ clientSlug, conversation }: Props) {

  const formRef = useRef<HTMLFormElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const [credits, setCredits]= useState(0)
  const [cost, setCost]= useState(0)
  const [messagesCount, setMessagesCount]= useState(0)
  const [copysCount, setCopysCount]= useState(0)

  const session= useSession()
  const userEmail= session?.data?.user?.email

  const { messages, setMessages, input, setInput, handleInputChange, handleSubmit, isLoading, error, addToolResult } = useChat({
    maxToolRoundtrips: 2,
    body: {
      conversationId: conversation.id,
      clientSlug
    },
    onFinish: () => {onFinishActions()}
  })

  function onFinishActions() {
    getTotalTokensActions(conversation.id)
    .then((totalTokens) => {
      setCredits(totalTokens/1000)
      setCost(totalTokens/1000000 * 5)
    })
  }

  useEffect(() => {
    const messagesDAO= conversation.messages
    const messages: Message[] = messagesDAO.map((message) => {
      return {
        id: message.id,
        createdAt: message.createdAt,
        role: message.role,
        name: message.name,
        content: message.content,
        toolInvocations: message.toolInvocations ? JSON.parse(message.toolInvocations) : []
      } as Message
    })
    const totalTokens= messagesDAO.reduce((acc, message) => acc + message.tokens, 0)
    setCredits(totalTokens/1000)
    setCost(totalTokens/1000000 * 5)
    setMessages(messages)
    setMessagesCount(messages.filter((message) => message.content).length)
    setCopysCount(messages.filter((message) => message.toolInvocations?.some(toolInvocation => toolInvocation.toolName === "entregarCopys")).length)
  }, [conversation])

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollIntoView(false)
    }
  };

  useEffect(() => {
    setMessagesCount(messages.filter((message) => message.content).length)
    setCopysCount(messages.filter((message) => message.toolInvocations?.some(toolInvocation => toolInvocation.toolName === "entregarCopys")).length)
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex-1 flex flex-col w-full">
      <div className="bg-background border p-4 flex items-center justify-between rounded-tr-lg border-l-0">
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10 border">
            <AvatarImage src={conversation.user.image || conversation.client.image || "/placeholder-user.jpg"} />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{conversation.title}</div>
            <div className="text-muted-foreground text-sm">Actualizado: {formatDistanceToNow(conversation.updatedAt, { locale: es })}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="border-gray-400">{messagesCount} mensajes</Badge>
          { copysCount > 0 && <Badge variant="secondary" className="border-gray-400">{copysCount} copys</Badge>}
          <Badge variant="secondary" className="border-gray-400">{credits.toFixed(1)} créditos</Badge>
          {/* {userEmail && userEmail === "rapha.uy@rapha.uy" && <Badge variant="secondary" className="border-gray-400">{cost.toFixed(3)} USD</Badge>} */}
          <TitleDialog id={conversation.id} title={conversation.title} />
        </div>
        
      </div>
      <div className="flex-1 overflow-auto p-4 gap-4 border-r bg-background">
        <ScrollArea className="h-[calc(100vh-360px)] pr-3">
          <div ref={scrollAreaRef}>

          {messages.length > 0 ? (
            messages.map((message, i) => {

              const messageDAO= message as MessageDAO
              return (
                <MessageBox key={i} 
                  message={message} 
                  userName={conversation.user.name || conversation.user.email || "YO"} 
                  userImage={conversation.user.image || conversation.client.image || "/placeholder-user.jpg"} 
                  addToolResult={addToolResult}
                />
            )}))
            :
            <SuggestedMessages setText={setInput} />
          }
          </div>

        </ScrollArea>

      </div>
      { error && <div className="bg-red-500 text-white p-4 rounded-lg mx-5">Ocurrió un error, intenta nuevamente.</div> }
      <div className="bg-background p-4 border-r border-b rounded-br-lg">
        <div className="relative">
          <form onSubmit={handleSubmit} ref={formRef}>
            <Textarea
              placeholder="Escribe tu mensaje..."
              name="message"
              id="message"
              rows={1}
              className="min-h-[48px] rounded-2xl resize-none p-4 border border-neutral-400 shadow-sm pr-16 w-full"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  formRef.current?.requestSubmit();
                  e.preventDefault();
                }
              }}  
            />
            <Button type="submit" size="icon" 
              className="absolute w-8 h-8 rounded-full"
              style={{ top: '45%', right: '1rem', transform: 'translateY(-50%)' }}
            >
              <ArrowUpIcon className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
