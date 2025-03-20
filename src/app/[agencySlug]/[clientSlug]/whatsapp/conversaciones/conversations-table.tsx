import { getClientIdBySlugs } from "@/services/client-services"
import { DataTable } from "./data-table"
import { getConversationsShortOfClient } from "@/services/conversation-services"
import { columns } from "./columns"

type Props = {
    agencySlug: string
    clientSlug: string
}

export async function ConversationsTable({ agencySlug, clientSlug }: Props) {
    const clientId = await getClientIdBySlugs(agencySlug, clientSlug)
    if (!clientId) return <div>Cliente no encontrado</div>

    const conversations = await getConversationsShortOfClient(clientId)
    if (!conversations || conversations.length === 0) {
        return <div className="p-3 py-4 mx-auto text-muted-foreground dark:text-white w-full text-center">
            No hay conversaciones
        </div>
    }

    return (
        <div className="pr-2 py-4 mx-auto text-muted-foreground min-w-72">
            <DataTable columns={columns} data={conversations} />
        </div>
    )
} 

export function ConversationsTableSkeleton() {
    return <div className="p-3 py-4 mx-auto text-muted-foreground dark:text-white min-w-72">
        {/* Input skeleton */}
        <div className="mb-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        </div>
        
        {/* Headers skeleton */}
        <div className="flex mb-2 border-b pb-2">
            <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-2"></div>
            <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Rows skeleton */}
        {[...Array(8)].map((_, i) => (
            <div key={i} className="flex py-3 border-b">
                <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-2"></div>
                <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
        ))}
    </div>
}