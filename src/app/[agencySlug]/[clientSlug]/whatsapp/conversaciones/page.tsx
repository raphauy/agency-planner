"use client"

import { toast } from "@/components/ui/use-toast"
import { ConversationDAO } from "@/services/conversation-services"
import { DocumentType, UserRole } from ".prisma/client"
import { Loader } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState, use } from "react";
import { getConversationDAOAction, getFullConversationsBySlugsAction, getLastConversationAction } from "./actions"
import { columns } from "./columns"
import ConversationBox from "./conversation-box"
import { DataTable } from "./data-table"

type Props= {
  params: Promise<{
    agencySlug: string
    clientSlug: string
  }>
  searchParams: Promise<{
    id: string
  }>
}
  
export default function ChatPage(props: Props) {
  const params = use(props.params);

  const {
    agencySlug,
    clientSlug
  } = params;

  const searchParams = use(props.searchParams);

  const {
    id
  } = searchParams;

  const session= useSession()

  const [loadingConversations, setLoadingConversations] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)
  const [showSystem, setShowSystem] = useState(false)

  const [conversation, setConversation] = useState<ConversationDAO>()
  const [conversations, setConversations] = useState<ConversationDAO[]>([])

  useEffect(() => {
    setLoadingChat(true)

    if (!id) {
      if (!agencySlug || !clientSlug) return
  
      getLastConversationAction(agencySlug, clientSlug, DocumentType.LEAD)
      .then(conversation => {
        if (conversation) setConversation(conversation)
      })    
      .catch(error => console.log(error))
      .finally(() => setLoadingChat(false))
    } else {
      getConversationDAOAction(id)
      .then(conversation => {
        if (conversation) setConversation(conversation)
      })
      .catch(error => console.log(error))
      .finally(() => setLoadingChat(false))
    }

    

  }, [id, agencySlug, clientSlug])


  useEffect(() => {   
    setLoadingConversations(true)

    getFullConversationsBySlugsAction(agencySlug, clientSlug)
    .then(data => {
      if (data) setConversations(data)
      if (data.length === 0) {
        toast({ title: "No hay conversaciones aún" })
      }
    })
    .catch(error => console.log(error))
    .finally(() => setLoadingConversations(false))
    

  }, [agencySlug, clientSlug, id])



  if (!conversation) return <div></div>

  const user= session.data?.user

  const isAdmin= user?.role === UserRole.ADMIN

  return (
    <div className="flex flex-grow w-full">

      {/* <div className="w-96">

        {
          loadingConversations ? 
            <Loader className="w-6 h-6 mx-auto animate-spin" /> :
            <div className="pr-2 mx-auto text-muted-foreground">
                <DataTable columns={columns} data={conversations} />
            </div> 
        }
          

      </div> */}

      <div className="flex flex-col items-center flex-grow">
        {
          loadingChat ?
          <Loader className="w-6 h-6 animate-spin" /> :
          <ConversationBox 
            conversation={conversation} 
            isAdmin={isAdmin} 
            showSystem={showSystem} 
            setShowSystem={setShowSystem} 
          />
        }
        
      </div>
    </div>

    );
}
    