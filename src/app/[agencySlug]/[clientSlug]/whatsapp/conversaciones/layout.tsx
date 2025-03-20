import { getClientIdBySlugs } from "@/services/client-services";
import { Suspense } from "react";
import { ConversationsTable, ConversationsTableSkeleton } from "./conversations-table";

interface Props {
  children: React.ReactNode
  params: Promise<{
    agencySlug: string
    clientSlug: string
  }>
}

export default async function ChatLayout({ children, params }: Props) {
  const { agencySlug, clientSlug } = await params

  const clientId= await getClientIdBySlugs(agencySlug, clientSlug)
  if (!clientId) return <div>Cliente no encontrado</div>

  return (
    <>
      <div className="flex flex-grow w-full">
        <div className="w-96 flex-shrink-0">
          <Suspense fallback={<ConversationsTableSkeleton />}>
            <ConversationsTable agencySlug={agencySlug} clientSlug={clientSlug} />
          </Suspense>
          {/* <ConversationsTable data={data} /> */}
        </div>
        <div className="flex flex-grow w-full">
          {children}
        </div>
      </div>
    </>
  )
}