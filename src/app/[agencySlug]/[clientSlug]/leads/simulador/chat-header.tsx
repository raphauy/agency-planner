"use client"

import { getFormatInTimezone } from "@/lib/utils"
import { CloseConversationDialog } from "../conversaciones/(delete-conversation)/delete-dialogs"
import { useEffect, useState } from "react"

type Props = {
    conversationId: string
    email: string
    date: Date | undefined
    isAdmin?: boolean
}
export default function ChatHeader({ conversationId: initialConversationId, email, date, isAdmin }: Props) {

    const [conversationId, setConversationId] = useState(initialConversationId)

    useEffect(() => {
        setConversationId(initialConversationId)
    }, [initialConversationId])

    return (
        <div className="flex items-center justify-between w-full">

            <div className="flex items-center justify-center gap-2 text-lg font-bold">
                <p>{email}</p>
                <p>{date && "(" + getFormatInTimezone(date, "America/Montevideo") + ")"}</p>
            </div>
            <div className="flex items-center justify-end w-full my-5">        
                <CloseConversationDialog id={conversationId} description={`Seguro que desea cerrar la conversación de ${email}?`} redirectUri={`simulator?r=${new Date().getMilliseconds()}`} closed={false} />
            </div>
        </div>
    )
}