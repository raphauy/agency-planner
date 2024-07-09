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

type Props= {
  clientSlug: string
  conversation: ConversationDAO
}

export function ChatComponent({ clientSlug, conversation }: Props) {

  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { messages, setMessages, input, setInput, handleInputChange, handleSubmit, isLoading, error } = useChat({
    maxToolRoundtrips: 5,
    body: {
      conversationId: conversation.id,
      clientSlug
    },
    onFinish: () => {onFinishActions()}
  })

  function onFinishActions() {
    //setFinishedCount((prev) => prev + 1)
    //scrollToBottom()
  }

  useEffect(() => {
    const messages: Message[] = conversation.messages.map((message) => {
      return {
        id: message.id,
        createdAt: message.createdAt,
        role: message.role,
        content: message.content
      } as Message
    })
    setMessages(messages)
  }, [conversation])

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollIntoView(false)
    }
  };

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  return (
    <div className="flex-1 flex flex-col w-full">
      <div className="bg-background border p-4 flex items-center justify-between rounded-tr-lg border-l-0">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 border">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{conversation.title}</div>
            <div className="text-muted-foreground text-sm">Actualizado: {formatDistanceToNow(conversation.updatedAt, { locale: es })}</div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoveVerticalIcon className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-4 gap-4 border-r bg-background">
        <ScrollArea className="h-[calc(100vh-360px)] pr-3">
          <div ref={scrollAreaRef}>

          {messages.length > 0 ? (
            messages.map((message, i) => {
              //if (message.role === "system") return null

              return (
              message.role === "assistant" ? (
              <div key={i} className="flex items-start gap-4 mt-4 mr-28">
                <Avatar className="w-9 h-9 border flex items-center justify-center">
                  <Bot className="w-7 h-7" />
                </Avatar>
                <div className="grid gap-1">
                  <div className="font-medium">Copy Lab</div>
                  <div className="bg-muted p-2 rounded-md">
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
                  </div>
                </div>
              </div>
              ) : (
                <div key={i} className="flex items-start gap-4 justify-end mt-4 ml-28">
                  <div className="grid gap-1">
                    <div className="font-medium text-right">{conversation.name}</div>
                    <div className="bg-primary text-primary-foreground p-2 rounded-md">
                      {message.content}
                    </div>
                  </div>
                  <Avatar className="w-8 h-8 border">
                    <AvatarImage src={conversation.user.image || conversation.client.image || "/placeholder-user.jpg"} />
                    <AvatarFallback>{conversation.user.name || conversation.user.email || "YO"}</AvatarFallback>
                  </Avatar>
                </div>
              )            
            )}))
            :
            <SuggestedMessages setText={setInput} />
          }
          </div>

        </ScrollArea>

      </div>
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
          {/* <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white shadow-lg z-50 absolute border"
            style={{ top: '-25px', right: '50%', transform: 'translateY(-50%)' }}
            onClick={scrollToBottom}
          >
            <ArrowDownIcon className="w-6 h-6" />
          </Button> */}

        </div>
      </div>
    </div>
  )
}
