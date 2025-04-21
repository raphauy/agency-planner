"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import Papa from "papaparse"
import type { CSVContact } from "@/services/audience-services"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Copy, Ban, File, InfoIcon, Loader, Save } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { addContactsToAudienceAction, getDuplicateEmailsAction } from "../audience-actions"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  const emailTrimmed = email.trim()
  if (emailTrimmed.length === 0) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(emailTrimmed)
}

type Props= {
    audienceId: string
}

export function CsvImporter({ audienceId }: Props) {
  const [csvData, setCsvData] = useState<any[]>([])
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [firstNameField, setFirstNameField] = useState<string>("")
  const [lastNameField, setLastNameField] = useState<string>("")
  const [nameField, setNameField] = useState<string>("")
  const [emailField, setEmailField] = useState<string>("")
  const [contacts, setContacts] = useState<CSVContact[]>([])
  const [duplicateEmails, setDuplicateEmails] = useState<string[]>([])
  const [invalidEmails, setInvalidEmails] = useState<string[]>([])
  const [fileName, setFileName] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [useSeparateNameFields, setUseSeparateNameFields] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isAddingContacts, setIsAddingContacts] = useState(false)

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      Papa.parse(file, {
        complete: (results) => {
          console.log("Resultados parseados:", results)
          if (results.data && results.data.length > 0) {
            const headers = Object.keys(results.data[0] as object)
            console.log("Encabezados extraídos:", headers)
            setCsvHeaders(headers)
            setCsvData(results.data as any[])
          }
        },
        header: true,
        skipEmptyLines: true,
      })
    }
    setLoading(false)
  }, [])

  useEffect(() => {    
    if (csvHeaders.length > 0) {
      const firstNameGuess = csvHeaders.find(
        (header) => header.toLowerCase().includes("first") || header.toLowerCase().includes("nombre"),
      )
      const lastNameGuess = csvHeaders.find(
        (header) => header.toLowerCase().includes("last") || header.toLowerCase().includes("apellido"),
      )
      const fullNameGuess = csvHeaders.find(
        (header) =>
          header.toLowerCase().includes("name") ||
          header.toLowerCase().includes("nombre") ||
          header.toLowerCase().includes("full"),
      )

      if (firstNameGuess && lastNameGuess) {
        setFirstNameField(firstNameGuess)
        setLastNameField(lastNameGuess)
        setUseSeparateNameFields(true)
      } else if (fullNameGuess) {
        setNameField(fullNameGuess)
        setUseSeparateNameFields(false)
      }

      const emailFieldGuess = csvHeaders.find(
        (header) =>
          header.toLowerCase().includes("email") ||
          header.toLowerCase().includes("mail") ||
          header.toLowerCase().includes("correo"),
      )
      if (emailFieldGuess) setEmailField(emailFieldGuess)
    }
  }, [csvHeaders])

  const handleFieldMapping = useCallback(async () => {
    setIsAddingContacts(true)
    if (
      emailField &&
      csvData.length > 0 &&
      ((useSeparateNameFields && (firstNameField || lastNameField)) || (!useSeparateNameFields && nameField))
    ) {
      const mappedContacts = csvData.map((row: any) => ({
        name: useSeparateNameFields
          ? `${row[firstNameField] || ""} ${row[lastNameField] || ""}`.trim()
          : row[nameField] || "",
        email: (row[emailField] || "").trim(),
      })) as CSVContact[]

      const invalidEmails = mappedContacts
        .filter((contact) => !isValidEmail(contact.email))
        .map((contact) => contact.email)

      const validEmails = mappedContacts
        .filter((contact) => isValidEmail(contact.email))
        .map((contact) => contact.email)

      const duplicateEmails = await getDuplicateEmailsAction(audienceId, validEmails)

      console.log("Contactos mapeados:", mappedContacts)
      setContacts(mappedContacts)
      setInvalidEmails(invalidEmails)
      setDuplicateEmails(duplicateEmails)
    }
    setIsAddingContacts(false)
  }, [firstNameField, lastNameField, nameField, emailField, csvData, useSeparateNameFields, audienceId])

  const handleAddContacts = useCallback(() => {
    setLoading(true)
    const validContacts = contacts.filter(
      (contact) => isValidEmail(contact.email) && !duplicateEmails.includes(contact.email),
    )
    console.log("Agregando contactos válidos a la audiencia:", audienceId, validContacts)
    addContactsToAudienceAction(audienceId, validContacts)
    .then(ignoredContacts => {
        const description= ignoredContacts > 0 ? `Se descartaron ${ignoredContacts} contactos debido a duplicados` : "Se agregaron todos los contactos"
        toast({
            title: "Contactos agregados",
            description: description,
        })
    })
    .catch(error => {
        toast({
            title: "Error",
            description: "Error al agregar contactos",
            variant: "destructive",
        })
    })
    .finally(() => {
        // set all to default
        setLoading(false)
        setIsDialogOpen(false)
        setIsAddingContacts(false)
        setContacts([])
        setCsvHeaders([])
        setFileName("")
        setFirstNameField("")
        setLastNameField("")
        setNameField("")
        setEmailField("")
        setInvalidEmails([])
        setDuplicateEmails([])
    })
  }, [contacts, duplicateEmails, audienceId])

  const handleCancel = useCallback(() => {
    setContacts([])
    setCsvHeaders([])
    setFileName("")
    setFirstNameField("")
    setLastNameField("")
    setNameField("")
    setEmailField("")
    setInvalidEmails([])
    setDuplicateEmails([])
    setIsDialogOpen(false)
    setUseSeparateNameFields(false)
  }, [])

  const validContactsCount = contacts.filter(
    (contact) => isValidEmail(contact.email) && !duplicateEmails.includes(contact.email),
  ).length

  const discardedContactsCount = invalidEmails.length + duplicateEmails.length

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-40 gap-2"><File className="w-5 h-5" /> Importar CSV</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Importar Contactos desde CSV</DialogTitle>
          <DialogDescription>Sube un archivo CSV y mapea los campos para importar tus contactos.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Input type="file" id="csvFile" accept=".csv" onChange={handleFileUpload} className="hidden" />
            <Button onClick={() => document.getElementById("csvFile")?.click()} variant="outline">
              Seleccionar archivo CSV
            </Button>
            {fileName && <span>{fileName}</span>}
          </div>

          {csvHeaders.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useSeparateNameFields"
                  checked={useSeparateNameFields}
                  onCheckedChange={(checked) => setUseSeparateNameFields(checked as boolean)}
                />
                <Label htmlFor="useSeparateNameFields">Usar campos separados para nombre y apellido</Label>
              </div>

              {useSeparateNameFields ? (
                <>
                  <div className="flex items-center space-x-4">
                    <Label htmlFor="firstNameField" className="w-20">
                      Nombre:
                    </Label>
                    <Select value={firstNameField} onValueChange={setFirstNameField}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccionar campo" />
                      </SelectTrigger>
                      <SelectContent>
                        {csvHeaders.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Label htmlFor="lastNameField" className="w-20">
                      Apellido:
                    </Label>
                    <Select value={lastNameField} onValueChange={setLastNameField}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccionar campo" />
                      </SelectTrigger>
                      <SelectContent>
                        {csvHeaders.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Label htmlFor="nameField" className="w-20">
                    Nombre:
                  </Label>
                  <Select value={nameField} onValueChange={setNameField}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Seleccionar campo" />
                    </SelectTrigger>
                    <SelectContent>
                      {csvHeaders.map((header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <Label htmlFor="emailField" className="w-20">
                  Email:
                </Label>
                <Select value={emailField} onValueChange={setEmailField}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Seleccionar campo" />
                  </SelectTrigger>
                  <SelectContent>
                    {csvHeaders.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-72 gap-2"
                onClick={handleFieldMapping}
                disabled={!emailField || (useSeparateNameFields ? !firstNameField && !lastNameField : !nameField)}
              >
                {isAddingContacts ? <Loader className="w-5 h-5 animate-spin" /> : <InfoIcon className="w-5 h-5" />}
                Previsualizar Contactos
              </Button>
            </div>
          )}

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
                  (Emails inválidos: {invalidEmails.length}, Duplicados: {duplicateEmails.length})
                </AlertDescription>
              </Alert>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={handleCancel} className="w-52">
                  Cancelar
                </Button>
                <Button onClick={handleAddContacts} className="w-52 gap-2">
                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Agregar Contactos
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

