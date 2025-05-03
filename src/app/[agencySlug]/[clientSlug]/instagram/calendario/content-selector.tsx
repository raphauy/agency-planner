"use client"

import { CalendarIcon, ImageIcon, PlayCircleIcon, PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { CalendarNoteDialog } from "./calendar-note-dialog"

type Props = {
  date: Date
  agencySlug: string
  clientSlug: string
  onClose: () => void
}

export function ContentSelector({ date, agencySlug, clientSlug, onClose }: Props) {
  const router = useRouter()
  const [openNoteDialog, setOpenNoteDialog] = useState(false)
  const formattedDate = format(date, "PPP", { locale: es })
  
  // Cerrar con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleCreateNote = () => {
    setOpenNoteDialog(true)
  }

  const handleCreatePost = () => {
    router.push(`/${agencySlug}/${clientSlug}/instagram/posts?newPost=true&type=INSTAGRAM_POST&date=${date.toISOString()}`)
    onClose()
  }

  const handleCreateStory = () => {
    router.push(`/${agencySlug}/${clientSlug}/instagram/historias?newPost=true&type=INSTAGRAM_STORY&date=${date.toISOString()}`)
    onClose()
  }

  const handleCreateReel = () => {
    router.push(`/${agencySlug}/${clientSlug}/instagram/reels?newPost=true&type=INSTAGRAM_REEL&date=${date.toISOString()}`)
    onClose()
  }

  // Si el diálogo de nota está abierto, mostrar solo el diálogo
  if (openNoteDialog) {
    return (
      <CalendarNoteDialog
        open={openNoteDialog}
        onOpenChange={(open) => {
          setOpenNoteDialog(open)
          if (!open) onClose()
        }}
        agencySlug={agencySlug}
        clientSlug={clientSlug}
        date={date}
      />
    )
  }

  return (
    <>
      {/* Fondo oscuro que cubre toda la pantalla */}
      <div 
        className="fixed inset-0 bg-black/20 z-50" 
        onClick={onClose}
      />
      
      {/* El selector en sí, centrado en la pantalla */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white shadow-lg rounded-lg border p-4 w-80">
        <h4 className="font-medium mb-3">Crear para {formattedDate}</h4>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={handleCreatePost}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Post
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={handleCreateStory}
          >
            <PenLine className="mr-2 h-4 w-4" />
            Historia
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={handleCreateReel}
          >
            <PlayCircleIcon className="mr-2 h-4 w-4" />
            Reel
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={handleCreateNote}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Nota
          </Button>
        </div>
      </div>
    </>
  )
} 