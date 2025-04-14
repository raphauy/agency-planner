"use client"

import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function ToastDestructive() {
  const { toast } = useToast()

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          variant: "destructive",
          title: "Tienes cambios sin guardar.",
          description: "Quieres guardar los cambios?",
          action: <ToastAction altText="Try again">Gaurdar</ToastAction>,
        })
      }}
    >
      Show Toast
    </Button>
  )
}
