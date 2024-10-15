"use client"

import { toast } from "@/components/ui/use-toast"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { Switch } from "./ui/switch"

type Props= {
  id: string
  icon?: React.ReactNode
  label: string
  description: string
  initialValue: boolean
  fieldName: string
  update: (id: string, fieldName: string, value: boolean) => Promise<boolean>
}

export function BooleanForm({ id, icon, label, description, initialValue, fieldName, update }: Props) {

  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  async function onChange(value: boolean) {
    setValue(value)
    setLoading(true)
    const ok= await update(id, fieldName, value)
    setLoading(false)
    if (ok) {
      toast({title: `${label} actualizado`})
    } else {
      toast({title: `Error al actualizar ${label}`, variant: "destructive"})
    }
  }

  return (
    <div className="mt-6 border rounded-md p-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2 font-bold">
            {icon && icon}
            {label}
          </div>
          <p className="text-sm">{description}</p>

        </div>
        <div className="w-16 flex justify-end">
        {
          loading ? (
            <Loader className="animate-spin" />
          ) : (
            <Switch
              checked={value}
              onCheckedChange={onChange}
            />
      )
        }
        </div>
      </div>
    </div>
  )
}