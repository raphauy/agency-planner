"use client"

import { Switch } from "@/components/ui/switch";
import { PublicationMember } from "@/services/publication-services";
import { addListenerAction, removeListenerAction } from "./publication-actions";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


type Props= {
    publicationId: string
    team: PublicationMember[]
}
export default function NotificationsBox({ publicationId, team }: Props) {

    const [loading, setLoading] = useState(false)
    const [processing, setProcessing] = useState("")

    function toggleListener(user: PublicationMember) {
        setProcessing(user.id)
        setLoading(true)
        if (user.listener) {
            removeListenerAction(publicationId, user.id)
            .then(() => {
                toast({ title: `Notificación eliminada para ${user.name}` })
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                setLoading(false)
                setProcessing("")
            })
        } else {
            addListenerAction(publicationId, user.id)
            .then(() => {
                toast({ title: `Notificación agregada para ${user.name}` })
            })
            .catch((error) => {
                console.error(error)
            })
            .finally(() => {
                setLoading(false)
                setProcessing("")
            })
        }
    }
    return (
        <div className="space-y-2">
                {
                    team.map((listener, index) => {
                        return (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-8 h-8 border">
                                        <AvatarImage alt="@shadcn" src={listener.image || "/placeholder-user.jpg"} />
                                        <AvatarFallback>{listener.name?.substring(0, 1)}</AvatarFallback>
                                    </Avatar>
                                    <p>{listener.name}</p>
                                </div>
                                {
                                    loading && listener.id === processing ? 
                                    <div className="w-12 flex justify-center"><Loader className="w-6 h-6 animate-spin" /></div>
                                    :
                                    <Switch 
                                        checked={listener.listener} 
                                        onCheckedChange={() => toggleListener(listener)}
                                    />
                                }
                            </div>
                        )
                    })
                }
        </div>

    );
}