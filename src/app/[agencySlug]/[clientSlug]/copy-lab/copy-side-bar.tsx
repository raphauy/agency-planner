"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn, formatWhatsAppStyle } from "@/lib/utils"
import { ConversationDAO } from "@/services/conversation-services"
import { ChatBubbleIcon } from "@radix-ui/react-icons"
import { ArrowRightToLine, BookOpen, PlusCircleIcon, Settings, SquareTerminal } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { TitleDialog } from "./_conversations/conversation-dialogs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Props {
  agencySlug: string
  clientSlug: string
  conversations: ConversationDAO[]
}

export function CopySideBar({ agencySlug, clientSlug, conversations }: Props) {

  const path= usePathname()

  return (
    <aside className="flex flex-col bg-background border transition-all duration-300 ease-in-out rounded-l-lg min-w-[300px]">
      <div className={cn("px-4 py-3 border-b", path.endsWith("documents") && "bg-muted/100")}>
        <Link href={`/${agencySlug}/${clientSlug}/copy-lab/documents`} prefetch={false}>
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-medium flex items-center gap-2"><BookOpen className="w-5 h-5" />Documentos</h3>
            <ArrowRightToLine className="w-5 h-5 mr-2" />
          </div>
        </Link>
      </div>
      <div className="flex items-center justify-between px-4 py-3 ">
        <h3 className="text-lg font-medium flex items-center gap-2"><ChatBubbleIcon className="w-5 h-5" />Chats</h3>
        <Link href={`/${agencySlug}/${clientSlug}/copy-lab/new`} prefetch={false}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <PlusCircleIcon className="w-5 h-5" />
          </Button>
        </Link>
      </div>
      <ScrollArea className="h-[calc(100vh-325px)]">
        <div className="grid gap-2 p-4">
          {conversations.map((conversation) => (
            <Link key={conversation.id} href={`/${agencySlug}/${clientSlug}/copy-lab/${conversation.id}`} prefetch={false}>
              <Button
                variant="ghost"
                className={cn("group flex items-center justify-between p-2 h-14 rounded-md hover:bg-muted/100 transition-colors w-full", path.endsWith(conversation.id) && "bg-muted/100 border")}
              >
                <div className="flex items-center gap-2 w-full">
                  <Avatar className="w-9 h-9 border">
                    <AvatarImage src={conversation.user.image || conversation.client.image || "/placeholder-user.jpg"} />
                    <AvatarFallback>{conversation.name}</AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <div className="font-bold">{conversation.user.name}</div>
                      <div className="text-muted-foreground text-sm">{formatWhatsAppStyle(conversation.createdAt)}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-muted-foreground text-sm text-start truncate w-44">{conversation.title}</div>
                      <div className="w-5 h-5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" >
                        <TitleDialog id={conversation.id} title={conversation.title} />
                      </div>
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
          ))}

        </div>
      </ScrollArea>
      <div className={cn("px-4 py-3 border-t", path.endsWith("settings") && "bg-muted/100")}>
        <Link href={`/${agencySlug}/${clientSlug}/copy-lab/settings`} prefetch={false}>
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-medium flex items-center gap-2"><Settings className="w-5 h-5" />Configuración</h3>
            <ArrowRightToLine className="w-5 h-5 mr-2" />
          </div>
        </Link>
      </div>
    </aside>
)
}
