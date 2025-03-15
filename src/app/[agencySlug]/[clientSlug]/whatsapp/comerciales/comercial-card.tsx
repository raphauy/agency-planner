import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { ComercialDAO } from "@/services/comercial-services"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Bell, BellOff, CheckCircle2, Clock, Loader, Mail, Phone, User, XCircle } from "lucide-react"
import { useState } from "react"
import { toggleComercialStatusAction } from "./comercial-actions"
import { ComercialDialog, DeleteComercialDialog } from "./comercial-dialogs"

type Props = {
    comercial: ComercialDAO
}

export default function ComercialCard({ comercial }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [isActive, setIsActive] = useState(comercial.activo)

    const handleToggleStatus = async () => {
        setIsLoading(true)
        try {
            const success = await toggleComercialStatusAction(comercial.id)
            if (success) {
                setIsActive(!isActive)
                toast({ 
                    title: "Estado actualizado",
                    description: `El comercial ahora está ${!isActive ? 'activo' : 'inactivo'}`
                })
            }
        } catch (error) {
            toast({ 
                title: "Error", 
                description: "No se pudo actualizar el estado", 
                variant: "destructive" 
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-lg">
            <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-lg">{comercial.user.name}</h3>
                </div>
                <Badge 
                    variant={isActive ? "default" : "secondaryWithBorder"}
                    className="cursor-pointer hover:opacity-80"
                    onClick={handleToggleStatus}
                >
                    {isLoading ? (
                        <Loader className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                        isActive ? 
                            <CheckCircle2 className="h-3 w-3 mr-1" /> : 
                            <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {isActive ? "Activo" : "Inactivo"}
                </Badge>
            </CardHeader>
            <CardContent className="flex justify-between items-center py-2">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{comercial.user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        { comercial.notifyAssigned ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                        <span className="text-sm">{comercial.notifyAssigned ? "Notificar asignación" : "NO notificar asignación"}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{comercial.phone}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ComercialDialog
                        id={comercial.id}
                        clientId={comercial.clientId}
                        users={[]}
                        chatwootUsers={[]}
                    />
                    <DeleteComercialDialog 
                        id={comercial.id} 
                        description={`¿Estás seguro que deseas eliminar al comercial ${comercial.user.name}? Todos los contactos asignados a este comercial quedarán sin comercial.`}
                    />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">
                        Actualizado {formatDistanceToNow(new Date(comercial.updatedAt), { addSuffix: true, locale: es })}
                    </span>
                </div>
                {comercial.chatwootUserId && (
                    <Badge variant="outline" className="text-xs">
                        Chatwoot: {comercial.chatwootUserName}
                    </Badge>
                )}
            </CardFooter>
        </Card>
    )
}