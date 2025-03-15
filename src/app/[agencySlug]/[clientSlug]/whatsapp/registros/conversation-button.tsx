"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams } from "next/navigation"

type Props = {
    name: string
    conversationId: string
}
export default function ConversationButton({ name, conversationId }: Props) {

    const params= useParams()
    const agencySlug= params.agencySlug
    const clientSlug= params.clientSlug

    return (
        <Link href={`/${agencySlug}/${clientSlug}/whatsapp/conversaciones?id=${conversationId}`}>
            <Button variant="link" className="px-0">
                {name}
            </Button>
        </Link>
    )
}
