"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { cn, getStatusColorAndLabel } from "@/lib/utils";
import { WRCInstance } from "@/services/wrc-sdk-types";
import { Loader, LogOut, MessageSquare, Power, QrCode, Trash2, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from "react";
import { connectInstanceAction, deleteInstanceAction, getConnectionStatusAction, logoutInstanceAction, restartInstanceAction } from "./actions";

const MAX_QR_CODE_COUNT = 10

interface ConnectionDetailsProps {
  clientId: string
  instance: WRCInstance
  chatwootAccountId: string | null | undefined
  whatsappInboxId: string | null | undefined
}
  
export function ConnectionDetails({ clientId, instance, chatwootAccountId, whatsappInboxId }: ConnectionDetailsProps) {

  const [loadingConnect, setLoadingConnect] = useState(false)
  const [loadingLogout, setLoadingLogout] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [loadingRestart, setLoadingRestart] = useState(false)
  const [status, setStatus] = useState(instance.connectionStatus)
  const [qrCode, setQRCode] = useState<string | null>(null)
  const [checkCount, setcheckCount] = useState(0)
  const [qrCodeCount, setqrCodeCount] = useState(0)

  const session= useSession()
  const userEmail= session.data?.user.email

  // only on status connecting, check and update status and do it every 2 seconds
  useEffect(() => {
    console.log("useEffect status connecting")
    if (status === 'connecting') {
      const intervalId = setInterval(() => {
        if (qrCodeCount >= MAX_QR_CODE_COUNT) {
          // disconnect
          clearInterval(intervalId)
          handleLogout()
        } else {
          handleConnect()
        }
      }, 2000)
      return () => clearInterval(intervalId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleConnect])

  useEffect(() => {
    console.log("getConnectionStatusAction by qrCode change")
    if (checkCount > 0) {
      toast({ title: "Para conectar escanea este nuevo código QR" })
      setqrCodeCount(qrCodeCount + 1)
    }
    getConnectionStatusAction(instance.name)
    .then((instance) => {
      setStatus(instance.state)
    })
    .catch((error) => {
      toast({ title: "Error obteniendo estado de conexión", description: error.message, variant: "destructive" })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance.name, qrCode])

  useEffect(() => {
    if (status === 'connecting') {
      handleConnect()
    } else {
      setQRCode(null)
      setcheckCount(0)
      setqrCodeCount(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  if (!instance) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center text-muted-foreground">
          Selecciona una instancia para ver los detalles
        </CardContent>
      </Card>
    )
  }

  function handleConnect() {
    console.log("connecting...")
    setLoadingConnect(true)
    connectInstanceAction(instance.name)
    .then((code) => {
        setQRCode(code)
        setcheckCount(checkCount + 1)
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
            setQRCode(null)
            setcheckCount(0)
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

    // check connection status
    getConnectionStatusAction(instance.name)
    .then((instance) => {
      setStatus(instance.state)
    })
    .catch((error) => {
      toast({ title: "Error obteniendo estado de conexión", description: error.message, variant: "destructive" })
    })
    
  }

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
                <CardTitle className="text-lg">Contactos</CardTitle>
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
        <div className="grid grid-cols-2 gap-2">
          <Button disabled={status === 'open'} onClick={handleConnect}>
            { loadingConnect ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Power className="w-4 h-4 mr-2" /> }
            { qrCode ? 'Refresh QR' : 'Conectar' }
          </Button>
          {/* <Button disabled={status === 'close'} onClick={handleRestart}>
            { loadingRestart ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" /> }
            Reiniciar
          </Button> */}
          <Button disabled={status === 'close'} onClick={handleLogout}>
            { loadingLogout ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" /> }
            Desconectar
          </Button>
          { userEmail === "rapha.uy@rapha.uy" &&
            <Button variant="destructive" disabled={status === 'open'} onClick={handleDelete} className="col-span-2 mt-8">
              { loadingDelete ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" /> }
              Eliminar
            </Button>
          }
        </div>
        <div className="flex justify-center items-center w-full">
          {qrCode && <QRCodeSVG value={qrCode} size={500} />}
        </div>
        {checkCount > 0 && 
          <div className="text-center flex justify-center items-center gap-2">            
            <QrCode className={cn("w-4 h-4", loadingConnect && "animate-spin")} />
            <p>{qrCodeCount} / {MAX_QR_CODE_COUNT}</p>
          </div>
        }

        <div className="space-y-4">
          <div className="text-center font-bold">Chatwoot asociado a la cuenta {chatwootAccountId}</div>
          <div className="text-center font-bold">Inbox {whatsappInboxId}</div>
        </div>

      </CardContent>
    </Card>
  )
}