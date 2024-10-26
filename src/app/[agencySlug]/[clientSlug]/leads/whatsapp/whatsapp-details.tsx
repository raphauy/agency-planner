"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { getStatusColorAndLabel } from "@/lib/utils";
import { WRCInstance } from "@/services/wrc-sdk-types";
import { Loader, LogOut, MessageSquare, Power, RefreshCw, User } from "lucide-react";
import { useEffect, useState } from "react";
import { connectInstanceAction, getConnectionStatusAction, logoutInstanceAction, restartInstanceAction } from "../chatwoot/actions";

type Props= {
  clientId: string
  instance: WRCInstance
  chatwootAccountId: number | null | undefined
}
  
export function WhatsappDetails({ clientId, instance, chatwootAccountId }: Props) {

  const [loadingConnect, setLoadingConnect] = useState(false)
  const [loadingLogout, setLoadingLogout] = useState(false)
  const [loadingRestart, setLoadingRestart] = useState(false)
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

  function handleConnect() {
    console.log("connect")
    setLoadingConnect(true)
    connectInstanceAction(instance.name)
    .then((code) => {
        toast({ title: "Para conectar escanea el código QR en Chatwoot" })
    })
    .catch((error) => {
        toast({ title: "Error conectando instancia", description: error.message, variant: "destructive" })
    })
    .finally(() => {
        setLoadingConnect(false)
    })
  }

  function handleLogout() {
    console.log("logout")
    
    setLoadingLogout(true)
    logoutInstanceAction(instance.name)
    .then((instance) => {
        if (instance) {
            setStatus(instance.connectionStatus)
            toast({ title: "Instancia desconectada" })
        } else {
            toast({ title: "Instancia desconectada", description: "Instancia no encontrada", variant: "destructive" })
        }
    })
    .catch((error) => {
        toast({ title: "Error desconectando instancia", description: error.message, variant: "destructive" })
    })
    .finally(() => {
        setLoadingLogout(false)
    })
  }

  function handleRestart() {
    console.log("restart")
    setLoadingRestart(true)
    restartInstanceAction(instance.name)
    .then((instance) => {
        setStatus(instance.connectionStatus)
        toast({ title: "Instancia reiniciada" })
    })
    .catch((error) => {
        toast({ title: "Error reiniciando instancia", description: error.message, variant: "destructive" })
    })
    .finally(() => {
        setLoadingRestart(false)
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
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Usuarios</CardTitle>
              </div>
              <p className="text-3xl font-bold mt-2">{instance._count.Contact}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Mensajes</CardTitle>
              </div>
              <p className="text-3xl font-bold mt-2">{instance._count.Message}</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-2 gap-2 pb-4">
          <Button disabled={status === 'open' || status === 'connecting'} onClick={handleConnect}>
            { loadingConnect ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Power className="w-4 h-4 mr-2" /> }
            { status === 'connecting' ? 'Escanea el código QR' : status === 'open' ? 'Conectado' : 'Conectar' }
          </Button>
          <Button disabled={status === 'close'} onClick={handleLogout}>
            { loadingLogout ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" /> }
            Desconectar
          </Button>
        </div>

        <Button disabled={status === 'close'} onClick={handleRestart} className="w-full">
          { loadingRestart ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" /> }
          Reiniciar
        </Button>


      </CardContent>
    </Card>
  )
}
