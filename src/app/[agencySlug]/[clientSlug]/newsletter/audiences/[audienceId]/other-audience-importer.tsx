"use client"

import { useState, useCallback } from "react"
import type { AudienceDAO } from "@/services/audience-services"
import type { SimpleEmailContactDAO } from "@/services/emailcontact-services"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Copy, Ban, InfoIcon, Loader, Save, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { addContactsToAudienceAction, getOtherAudiencesDAOAction, getDuplicateEmailsAction } from "../audience-actions"
import { getAudienceContactsDAOAction } from "../audience-actions"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type Props = {
    audienceId: string
}

// Agregar esta función de validación de email antes del componente
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export function OtherAudienceImporter({ audienceId }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [otherAudiences, setOtherAudiences] = useState<AudienceDAO[]>([])
    const [selectedAudienceId, setSelectedAudienceId] = useState<string>("")
    const [contacts, setContacts] = useState<SimpleEmailContactDAO[]>([])
    const [duplicateEmails, setDuplicateEmails] = useState<string[]>([])
    const [isLoadingContacts, setIsLoadingContacts] = useState(false)

    // Cargar las otras audiencias cuando se abre el diálogo
    const handleDialogOpen = useCallback(async (open: boolean) => {
        setIsDialogOpen(open)
        if (open) {
            setLoading(true)
            try {
                const audiences = await getOtherAudiencesDAOAction(audienceId)
                setOtherAudiences(audiences)
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Error al cargar las audiencias",
                    variant: "destructive",
                })
            }
            setLoading(false)
        }
    }, [audienceId])

    // Cargar los contactos de la audiencia seleccionada
    const handleAudienceSelect = useCallback(async (selectedId: string) => {
        setSelectedAudienceId(selectedId)
        setIsLoadingContacts(true)
        try {
            const audienceContacts = await getAudienceContactsDAOAction(selectedId)
            const emails = audienceContacts.map(contact => contact.email)
            const duplicates = await getDuplicateEmailsAction(audienceId, emails)
            setContacts(audienceContacts)
            setDuplicateEmails(duplicates)
        } catch (error) {
            toast({
                title: "Error",
                description: "Error al cargar los contactos",
                variant: "destructive",
            })
        }
        setIsLoadingContacts(false)
    }, [audienceId])

    const handleCancel = useCallback(() => {
        setSelectedAudienceId("")
        setContacts([])
        setDuplicateEmails([])
        setIsDialogOpen(false)
    }, [])

    const handleAddContacts = useCallback(async () => {
        setLoading(true)
        const validContacts = contacts.filter(contact => !duplicateEmails.includes(contact.email))
        try {
            const ignoredContacts = await addContactsToAudienceAction(audienceId, validContacts.map(contact => ({
                name: contact.name || "",
                email: contact.email
            })))
            const description = ignoredContacts > 0 
                ? `Se descartaron ${ignoredContacts} contactos debido a duplicados` 
                : "Se agregaron todos los contactos"
            toast({
                title: "Contactos agregados",
                description: description,
            })
            handleCancel()
        } catch (error) {
            toast({
                title: "Error",
                description: "Error al agregar contactos",
                variant: "destructive",
            })
            setLoading(false)
        }
    }, [audienceId, contacts, duplicateEmails, handleCancel])

    const validContactsCount = contacts.filter(contact => !duplicateEmails.includes(contact.email)).length
    const discardedContactsCount = duplicateEmails.length

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
            <DialogTrigger asChild>
                <Button className="w-40 gap-2"><Users className="w-5 h-5" /> Importar Audiencia</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Importar Contactos desde otra Audiencia</DialogTitle>
                    <DialogDescription>Selecciona una audiencia para importar sus contactos.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Label htmlFor="audienceSelect" className="w-20">
                            Audiencia:
                        </Label>
                        <Select value={selectedAudienceId} onValueChange={handleAudienceSelect}>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Seleccionar audiencia" />
                            </SelectTrigger>
                            <SelectContent>
                                {otherAudiences.map((audience) => (
                                    <SelectItem key={audience.id} value={audience.id}>
                                        {audience.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {contacts.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">Previsualización de Contactos</h2>

                            <ScrollArea className="h-[300px] w-full rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Email</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {contacts.map((contact, index) => {
                                            const isEmailValid = isValidEmail(contact.email)
                                            const isDuplicate = duplicateEmails.includes(contact.email)
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell className="w-[100px]">
                                                        {isDuplicate ? (
                                                            <div className="flex items-center gap-2 text-yellow-500">
                                                                <Copy className="w-5 h-5" />
                                                                <span className="text-xs">Duplicado</span>
                                                            </div>
                                                        ) : !isEmailValid ? (
                                                            <div className="flex items-center gap-2 text-red-500">
                                                                <Ban className="w-5 h-5" />
                                                                <span className="text-xs">Inválido</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-green-500">
                                                                <CheckCircle className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{contact.name}</TableCell>
                                                    <TableCell className={cn(
                                                        isDuplicate && "line-through text-yellow-500",
                                                        !isEmailValid && "text-red-500"
                                                    )}>
                                                        {contact.email}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </ScrollArea>

                            <Alert>
                                <InfoIcon className="h-4 w-4" />
                                <AlertTitle>Resumen de importación</AlertTitle>
                                <AlertDescription>
                                    Registros válidos: {validContactsCount}
                                    <br />
                                    Registros a descartar: {discardedContactsCount}
                                    <br />
                                    (Duplicados: {duplicateEmails.length})
                                </AlertDescription>
                            </Alert>

                            <div className="flex justify-end space-x-4">
                                <Button variant="outline" onClick={handleCancel} className="w-52" disabled={loading}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleAddContacts} className="w-52 gap-2" disabled={loading}>
                                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    Agregar Contactos
                                </Button>
                            </div>
                        </div>
                    )}

                    {isLoadingContacts && (
                        <div className="flex justify-center py-4">
                            <Loader className="w-6 h-6 animate-spin" />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}