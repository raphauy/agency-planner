"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { FormDescription } from "@/components/ui/form"

interface ListGeneratorProps {
  options: string[]
  onChange: (options: string[]) => void
}

export function ListGenerator({ options = [], onChange }: ListGeneratorProps) {
  const [newOption, setNewOption] = useState("")

  const handleAddOption = () => {
    if (!newOption.trim()) return
    const updatedOptions = [...options, newOption.trim()]
    onChange(updatedOptions)
    setNewOption("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddOption()
    }
  }

  const handleRemoveOption = (indexToRemove: number) => {
    const updatedOptions = options.filter((_, index) => index !== indexToRemove)
    onChange(updatedOptions)
  }

  return (
    <div className="space-y-2 rounded-lg border border-input bg-background p-4">
      <div className="mb-4">
        <div className="text-sm font-medium mb-1.5">Opciones de la lista</div>
        <FormDescription>
          Agrega las opciones que estarán disponibles para seleccionar en este campo
        </FormDescription>
      </div>

      <div className="flex gap-2 mb-4">
        <Input          
          placeholder="Agregar opción..."
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1"
        />
        <Button 
          type="button"
          onClick={handleAddOption}
          variant="secondary"
        >
          Agregar
        </Button>
      </div>

      {options.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-sm"
            >
              <span>{option}</span>
              <button
                type="button"
                onClick={() => handleRemoveOption(index)}
                className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}