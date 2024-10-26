"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader, MessageSquare } from "lucide-react";
import { enableChatwootAction } from "./actions";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";


type ChatwootButtonProps = {
    clientId: string;
    instanceName: string;    
}
export default function ChatwootButton({ clientId, instanceName }: ChatwootButtonProps) {
    const [loadingSetChatwoot, setLoadingSetChatwoot] = useState(false)
    const [chatwootAccountId, setChatwootAccountId] = useState<number | undefined>(0)
    const [signMsg, setSignMsg] = useState(true)

    function handleEnableChatwoot() {
        if (!chatwootAccountId) {
            toast({ title: "Se necesita un ID de cuenta de Chatwoot mayor a 0", variant: "destructive" })
            return
        }

        setLoadingSetChatwoot(true)
        enableChatwootAction(clientId, instanceName, chatwootAccountId, signMsg)
        .then((result) => {
          if (result) {
            toast({ title: "Chatwoot habilitado" })
          } else {
            toast({ title: "Error habilitando Chatwoot", description: "No se pudo habilitar Chatwoot", variant: "destructive" })
          }
        })
        .catch((error) => {
          toast({ title: "Error habilitando Chatwoot", description: error.message, variant: "destructive" })
        })
        .finally(() => {
            setLoadingSetChatwoot(false)
        })
      }
    
    
    return (
        <div className="flex flex-col gap-4 border p-8 rounded-md w-full">
            <Input
                type="number"
                placeholder="ID de la cuenta de Chatwoot"
                value={chatwootAccountId}
                onChange={(e) => setChatwootAccountId(parseInt(e.target.value))}
            />
            <div className="flex items-center gap-2">
              <Switch
                  checked={signMsg}
                  onCheckedChange={setSignMsg}
              />
              <p>Responer con nombre del agente</p>
            </div>
            <Button onClick={handleEnableChatwoot} className="col-span-2 mt-2">
            { loadingSetChatwoot ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <MessageSquare className="w-4 h-4 mr-2" /> }
            Habilitar Chatwoot
        </Button>
        </div>
    )
}