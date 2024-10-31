"use client"

import { useState, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Save, Upload, Search } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { setIgnoredNumbersAction } from "@/app/[agencySlug]/clients/client-actions"

const noRingClass = "focus-visible:ring-0 focus-visible:ring-offset-0"

type Props = {
  clientId: string
  initialPhones: string
}
export function PhoneList({ clientId, initialPhones }: Props) {
  const [phones, setPhones] = useState<string[]>(
    Array.from(new Set(initialPhones.split(',').map(phone => phone.trim()).filter(Boolean)))
  )
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [lastUpload, setLastUpload] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+\d{10}$/
    return phoneRegex.test(phone)
  }

  const addPhone = () => {
    const newPhone = "+598"
    if (!phones.includes(newPhone)) {
      setPhones([...phones, newPhone])
      setEditIndex(phones.length)
    } else {
      toast({
        title: "Número duplicado",
        description: "Este número ya existe en la lista.",
        variant: "destructive",
      })
    }
  }

  const editPhone = (index: number, value: string) => {
    const newPhones = [...phones]
    newPhones[index] = value
    setPhones(newPhones)
  }

  const finishEdit = (index: number) => {
    const phone = phones[index]
    if (!validatePhone(phone)) {
      setErrorMessage("El número debe tener el formato +xxx... (con mínimo 8 dígitos).")
      return
    }
    if (phones.filter((p, i) => i !== index).includes(phone)) {
      setErrorMessage("Este número ya existe en la lista.")
      return
    }
    setEditIndex(null)
    setErrorMessage("")
  }

  const deletePhone = (index: number) => {
    setPhones(phones.filter((_, i) => i !== index))
    setEditIndex(null)
    setErrorMessage("")
  }

  const savePhones = () => {
    if (phones.every(validatePhone)) {
      const phoneString = phones.join(',')
      console.log(phoneString)
      setIgnoredNumbersAction(clientId, phoneString)
      .then(() => {
        toast({ title: "Teléfonos guardados", description: "Los números han sido guardados exitosamente.",
        })
      })
        .catch((error) => {
          toast({ title: "Error al guardar", description: error.message, variant: "destructive" })
        })
    } else {
      toast({
        title: "Error al guardar",
        description: "Algunos números no tienen el formato correcto.",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const newPhones = content
        .split(/[,\n]/)
        .map(phone => phone.trim())
        .filter(phone => phone.length > 0)
        .map(phone => {
          if (phone.startsWith('0')) {
            return `+598${phone.slice(1)}`
          } else if (phone.startsWith('+')) {
            return phone
          } else {
            return `+${phone}`
          }
        })

      const uniqueNewPhones = Array.from(new Set(newPhones))
      const phonesToAdd = uniqueNewPhones.filter(phone => !phones.includes(phone))

      setPhones(prevPhones => [...prevPhones, ...phonesToAdd])
      toast({
        title: "Archivo cargado",
        description: `Se han agregado ${phonesToAdd.length} números de teléfono únicos.`,
      })
    }
    reader.readAsText(file)

    if (event.target) {
      event.target.value = ''
    }
    setLastUpload(Date.now())
  }

  const filteredPhones = phones.filter(phone => phone.includes(searchTerm))

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4">
        Teléfonos ignorados {phones.length > 0 && `(${phones.length})`}
      </h2>
      <div className="flex space-x-2">
        <Button onClick={addPhone} className="flex-grow">
          <Plus className="mr-2 h-4 w-4" /> Agregar Teléfono
        </Button>
        <Button onClick={() => fileInputRef.current?.click()} className="flex-grow">
          <Upload className="mr-2 h-4 w-4" /> Subir Archivo
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt"
          style={{ display: 'none' }}
          key={lastUpload}
        />
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar números..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full"
        />
      </div>
      <ScrollArea className="h-[400px] w-full border rounded-md p-6 bg-background">
        {filteredPhones.map((phone, index) => (
          <div key={index} className="flex items-center space-x-2 border-b py-1">
            <div className="flex-grow" style={{ width: '240px' }}>
              {editIndex === index ? (
                <Input
                  value={phone}
                  onChange={(e) => editPhone(index, e.target.value)}
                  onBlur={() => finishEdit(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      finishEdit(index)
                    }
                  }}
                  autoFocus
                  className={cn("w-full", noRingClass)}
                  style={{ width: '100%' }}
                />
              ) : (
                <div 
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded w-full"
                  onClick={() => setEditIndex(index)}
                  style={{ width: '100%' }}
                >
                  {phone}
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={() => deletePhone(index)} className="flex-shrink-0">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </ScrollArea>
      <div className="h-6 text-red-500 text-sm">
        {errorMessage}
      </div>
      <Button onClick={savePhones} className="w-full">
        <Save className="mr-2 h-4 w-4" /> Guardar
      </Button>
    </div>
  )
}