import SimulatorBox from "../assistant/simulator-box"

type Props = {
    params: {
        clientSlug: string
        conversationId: string
    },
}
export default async function SimulatorPage({ params }: Props) {
    const clientSlug= params.clientSlug as string
    const conversationId= params.conversationId as string    

    if (!conversationId) return <div>ConversationId not found</div>
  
    return (
        <div className="flex flex-col items-center w-full h-full">
          <SimulatorBox clientSlug={clientSlug} conversationId={conversationId} />
        </div>
    )
}
