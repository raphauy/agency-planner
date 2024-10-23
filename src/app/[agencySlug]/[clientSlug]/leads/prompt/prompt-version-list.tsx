"use client"

import { useMemo } from 'react'
import { format, isToday, isYesterday, isThisWeek } from 'date-fns'
import { es } from 'date-fns/locale'
import { MoreVertical, Trash, ArrowUpCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PromptVersionDAO } from '@/services/prompt-version-services'
import { toZonedTime } from 'date-fns-tz'

type Props = {
  versions: PromptVersionDAO[]
  selectedVersion: PromptVersionDAO | null
  currentPrompt: string
  timezone: string
  onViewVersion: (version: PromptVersionDAO) => void
  onUseVersion: (version: PromptVersionDAO) => void
  onDeleteVersion: (id: string) => void
}

export default function PromptVersionList({
  versions,
  selectedVersion,
  currentPrompt,
  timezone,
  onViewVersion,
  onUseVersion,
  onDeleteVersion
}: Props) {
  const groupedVersions = useMemo(() => {
    const groups: { [key: string]: PromptVersionDAO[] } = {
      'Hoy': [],
      'Ayer': [],
      'Esta semana': [],
      'Anteriores': []
    }

    versions.forEach(version => {
      if (isToday(version.timestamp)) {
        groups['Hoy'].push(version)
      } else if (isYesterday(version.timestamp)) {
        groups['Ayer'].push(version)
      } else if (isThisWeek(version.timestamp)) {
        groups['Esta semana'].push(version)
      } else {
        groups['Anteriores'].push(version)
      }
    })

    return groups
  }, [versions])

  return (
    <ScrollArea className="h-full max-h-[500px]">
      {Object.entries(groupedVersions).map(([group, groupVersions]) => (
        groupVersions.length > 0 && (
          <div key={group} className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground px-4 py-2">{group}</h3>
            {groupVersions.map((version) => (
              <div
                key={version.id}
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-accent ${
                  selectedVersion?.id === version.id ? 'bg-accent' : 'bg-background'
                }`}
                onClick={() => onViewVersion(version)}
              >
                <div>
                  <p className="font-medium">
                    {format(toZonedTime(version.timestamp, timezone), "d 'de' MMMM, HH:mm", { locale: es })}
                  </p>
                  <p className="text-sm text-muted-foreground">{version.user}</p>
                  {currentPrompt === version.content && (
                    <p className="text-sm text-primary mt-1 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Versión actual
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onUseVersion(version)}>
                      <ArrowUpCircle className="mr-2 h-4 w-4" />
                      <span>Aplicar esta versión</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteVersion(version.id)} disabled={currentPrompt === version.content}>
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )
      ))}
    </ScrollArea>
  )
}