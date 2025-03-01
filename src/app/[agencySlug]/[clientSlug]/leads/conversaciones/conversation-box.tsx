import { Badge } from "@/components/ui/badge"
import { getFormatInTimezone } from "@/lib/utils"
import { ConversationDAO } from "@/services/conversation-services"
import { CloseConversationDialog, DeleteConversationDialog } from "./(delete-conversation)/delete-dialogs"
import ConversationMessageBox from "./conversation-message-box"

type Props = {
  conversation: ConversationDAO
  isAdmin: boolean
  showSystem: boolean
  setShowSystem: (showSystem: boolean) => void
}
  
export default function ConversationBox({ conversation, isAdmin, showSystem, setShowSystem}: Props) {

  const totalTokens= conversation.messages.reduce((acc, message) => acc + message.tokens, 0)
  const messagesCount= conversation.messages.length
  const credits= totalTokens / 1000

  const messages= showSystem && isAdmin ? conversation.messages : conversation.messages.filter(message => message.role !== "system")

  return (
      <main className="flex flex-col items-center justify-between w-full p-3 border-l">
        <div className="flex justify-between w-full pb-2 text-center border-b">
          <div>
            <p className="text-lg font-bold">{conversation.phone} ({getFormatInTimezone(conversation.updatedAt, "America/Montevideo")})</p>
            {
              totalTokens > 0 && isAdmin && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="border-gray-400">{messagesCount} mensajes</Badge>
                  <Badge variant="secondary" className="border-gray-400">{credits.toFixed(1)} créditos</Badge>
                </div>
              )
            }
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && 
              <>
                <CloseConversationDialog id={conversation.id} description={`Seguro que desea cerrar la conversación de ${conversation.phone}`} redirectUri={`conversaciones`} closed={conversation.closed} />
                <DeleteConversationDialog id={conversation.id} description={`Seguro que desea eliminar la conversación de ${conversation.phone}`} redirectUri={`conversaciones`} />
              </>
            }
          </div>          
        </div>  

        <div className="w-full mt-5">
          {messages.map((message, i) => {
            return(
              <ConversationMessageBox key={i} message={message} />            
            )})
          }
      </div>

      </main>
    );
  }


