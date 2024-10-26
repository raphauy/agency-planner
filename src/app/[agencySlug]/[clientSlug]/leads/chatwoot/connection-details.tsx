"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { getStatusColorAndLabel } from "@/lib/utils";
import { WRCInstance } from "@/services/wrc-sdk-types";
import { Loader, LogOut, MessageSquare, Power, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { connectInstanceAction, deleteInstanceAction, getConnectionStatusAction, logoutInstanceAction, restartInstanceAction } from "./actions";
import ChatwootButton from "./chatwoot-button";

type Props= {
  clientId: string
  instance: WRCInstance
  chatwootAccountId: number | null | undefined
}
  
export function ConnectionDetails({ clientId, instance, chatwootAccountId }: Props) {

  const [loadingDelete, setLoadingDelete] = useState(false)
  const [status, setStatus] = useState(instance.connectionStatus)

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkStatus = () => {
      console.log("checkStatus")
      getConnectionStatusAction(instance.name)
        .then((instance) => {
          setStatus(instance.state);
          // Ajustar el intervalo basado en el estado
          const interval = instance.state === 'connecting' ? 3000 : 10000;
          intervalId = setTimeout(checkStatus, interval);
        })
        .catch((error) => {
          toast({ title: "Error obteniendo estado de conexión", description: error.message, variant: "destructive" });
          // En caso de error, intentar nuevamente después de 15 segundos
          intervalId = setTimeout(checkStatus, 15000);
        });
    };

    // Iniciar el chequeo de estado
    checkStatus();

    // Limpiar el intervalo cuando el componente se desmonte
    return () => {
      if (intervalId) clearTimeout(intervalId);
    };
  }, [instance.name]);

  function handleDelete() {
    console.log("delete")

    setLoadingDelete(true)
    deleteInstanceAction(instance.name)
    .then(() => {
        toast({ title: "Instancia eliminada" })
    })
    .catch((error) => {
        toast({ title: "Error eliminando instancia", description: error.message, variant: "destructive" })
    })
    .finally(() => {
        setLoadingDelete(false)
    })
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center">
          <Avatar className="h-10 w-10 mr-3">
            {instance.profilePicUrl ? (
              <AvatarImage src={instance.profilePicUrl} alt={instance.name} />
            ) : (
              <AvatarFallback>{instance.name?.slice(0, 2).toUpperCase() || 'NA'}</AvatarFallback>
            )}
          </Avatar>
          <CardTitle className="text-2xl font-bold">{instance.name}</CardTitle>
        </div>

        <Badge variant={status as "open" | "close" | "connecting"}>
          {getStatusColorAndLabel(status)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="destructive" disabled={status === 'open'} onClick={handleDelete} className="col-span-2 mt-8">
            { loadingDelete ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" /> }
            Eliminar Instancia WRC
          </Button>

        </div>

        <div className="col-span-2 mt-8">
          {
            !chatwootAccountId ? (
              <ChatwootButton clientId={clientId} instanceName={instance.name} />
            ) : (
              <div className="text-center font-bold">Chatwoot asociado a la cuenta {chatwootAccountId}</div>
            )
          }
        </div>
      </CardContent>
    </Card>
  )
}