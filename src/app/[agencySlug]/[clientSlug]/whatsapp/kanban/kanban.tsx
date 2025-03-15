'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/use-toast'
import { ComercialDAO } from '@/services/comercial-services'
import { ContactDAO } from '@/services/contact-services'
import { KanbanStageDAO, KanbanStageDAOWithContacts } from '@/services/stage-services'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { createMovedToStageEventAction, updateStageContactsAction } from '../contactos/contact-actions'
import { updateKanbanStagesAction } from '../stages/stage-actions'
import { StageDialog } from '../stages/stage-dialogs'
import StageColumn from './stage-column'
import TagSelector from './tag-selector'
import { ContactDetailsSheet } from '../contactos/contact-details-sheet'

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

type Props = {
  clientId: string
  initialStages: KanbanStageDAOWithContacts[]
  allTags: string[]
  comercials: ComercialDAO[]
  phone?: string
}

export function KanbanComponent({ clientId, initialStages, allTags, comercials, phone }: Props) {
  const [stages, setStages] = useState<KanbanStageDAOWithContacts[]>(initialStages)
  const [filteredTags, setFilteredTags] = useState<string[]>([])
  const [phoneFilter, setPhoneFilter] = useState<string>("")
  const [selectedComercial, setSelectedComercial] = useState<string>("")
  const [showMyContacts, setShowMyContacts] = useState(false)
  const [selectedContact, setSelectedContact] = useState<ContactDAO | null>(null)
  const { data: session } = useSession()
  const user = session?.user

  // Buscar el comercial asociado al usuario actual
  const userComercial = comercials.find(comercial => comercial.userId === user?.id)

  useEffect(() => {
    const filteredStages = initialStages.map(stage => ({
      ...stage,
      contacts: stage.contacts.filter(contact => {
        const matchesTags = filteredTags.length === 0 || contact.tags?.some(tag => filteredTags.includes(tag));
        const matchesPhone = !phoneFilter || 
          contact.phone?.toLowerCase().includes(phoneFilter.toLowerCase()) ||
          contact.name?.toLowerCase().includes(phoneFilter.toLowerCase());
        const matchesComercial = !selectedComercial || contact.comercialId === selectedComercial;
        
        return matchesTags && matchesPhone && matchesComercial;
      })
    }));
    setStages(filteredStages);
  }, [initialStages, filteredTags, phoneFilter, selectedComercial]);

  // Efecto para manejar el switch de "Mis contactos"
  useEffect(() => {
    if (showMyContacts && userComercial) {
      setSelectedComercial(userComercial.id);
    } else if (!showMyContacts && userComercial) {
      setSelectedComercial("");
    }
  }, [showMyContacts, userComercial]);

  useEffect(() => {
    setPhoneFilter(phone?.trim() || "")
  }, [phone])

  const handleContactClick = (contact: ContactDAO) => {
    setSelectedContact(contact)
  }

  const handleCloseSheet = () => {
    setSelectedContact(null)
  }

  function updateKanbanStages(orderedStages: KanbanStageDAO[]) {
    updateKanbanStagesAction(clientId, orderedStages)
    .then(() => {
      toast({title: "Estado actualizado"})
    })
    .catch((error) => {
      console.error(error)
    })
  }

  function updateStageContacts(contacts: ContactDAO[]) {
    updateStageContactsAction(contacts)
    .then(() => {
      toast({title: "Contacto actualizado"})
    })
    .catch((error) => {
      console.error(error)
    })
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result
    if (!destination) return
    // if dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
    // User moves a list
    if (type === 'list') {
      const newStages = reorder(stages, source.index, destination.index).map((item, index) => ({ ...item, order: index }))
      setStages(newStages)
      updateKanbanStages(newStages as KanbanStageDAO[])
    }
    // User moves a contact
    if (type === 'contact') {
      let newOrderedData = [...stages]

      // Source and destination lists
      const sourceList = newOrderedData.find(list => list.id === source.droppableId)
      const destinationList = newOrderedData.find(list => list.id === destination.droppableId)
      if (!sourceList || !destinationList) return

      // Check if contacts exist in the source list
      if (!sourceList.contacts) {
        sourceList.contacts = []
      }

      // Check if contacts exist in the destination list
      if (!destinationList.contacts) {
        destinationList.contacts = []
      }

      // Moving the contact in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedContacts = reorder(sourceList.contacts, source.index, destination.index)
        reorderedContacts.forEach((contact, index) => contact.order = index)
        sourceList.contacts = reorderedContacts
        setStages(newOrderedData)
        updateStageContacts(reorderedContacts)
      }

      // Moving the contact to another list
      if (source.droppableId !== destination.droppableId) {
        // Remove contact from source list
        const [movedContact] = sourceList.contacts.splice(source.index, 1)

        // Assign the new stage to the moved contact
        movedContact.stageId = destination.droppableId

        // Add contact to the destination list
        destinationList.contacts.splice(destination.index, 0, movedContact)

        // Update order of contacts in source and destination lists
        sourceList.contacts.forEach((contact, index) => contact.order = index)

        // Update order of contacts in destination list
        destinationList.contacts.forEach((contact, index) => contact.order = index)

        setStages(newOrderedData)
        updateStageContacts(destinationList.contacts)
        createMovedToStageEventAction(movedContact.id, destinationList.name)
      }
    }
  }

  function handleTagsChange(tags: string[]) {
    setFilteredTags(tags)
    return Promise.resolve(true)
  }

  return (
    <div>
      <div className="flex flex-col gap-4 max-w-[820px] w-full mb-4">
        {comercials.length > 0 && (
          <div className="flex items-center gap-2">
            <p className="font-bold w-24">Comercial:</p>
            <div className="w-full">
              <Select
                value={selectedComercial}
                onValueChange={(value) => {
                  setSelectedComercial(value === "all" ? "" : value);
                  setShowMyContacts(false);
                }}
                disabled={showMyContacts}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los comerciales" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los comerciales</SelectItem>
                  {comercials.map((comercial) => (
                    <SelectItem key={comercial.id} value={comercial.id}>
                      {comercial.user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {userComercial && (
              <div className="flex items-center gap-2 ml-4">
                <Switch
                  checked={showMyContacts}
                  onCheckedChange={setShowMyContacts}
                  id="my-contacts"
                />
                <label htmlFor="my-contacts" className="text-sm font-medium">
                  Mis contactos
                </label>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-2">
          <p className="font-bold w-24">Etiquetas:</p>
          <TagSelector actualTags={filteredTags} allTags={allTags} onChange={handleTagsChange} placeholder='Filtrar etiquetas...' />
        </div>
        <div className="flex items-center gap-2">
          <p className="font-bold w-24">Contacto:</p>
          <input
            type="search"
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            placeholder="Filtrar por teléfono o nombre..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="stages" type='list' direction='horizontal'>
          {(provided) => (
            <ol className="flex gap-x-3 h-full min-h-[600px]" ref={provided.innerRef} {...provided.droppableProps}>
              {stages.map((stage, index) => (
                <StageColumn 
                  key={stage.id} 
                  stage={stage} 
                  index={index} 
                  allTags={allTags} 
                  filteredTags={filteredTags}
                  phoneFilter={phoneFilter}
                  onContactClick={handleContactClick} 
                />
              ))}
              {provided.placeholder}
              <StageDialog clientId={clientId} />
              <div className='flex-shrink-0 w-1' />
            </ol>
          )}
        </Droppable>
      </DragDropContext>
      <ContactDetailsSheet
        contact={selectedContact}
        isOpen={selectedContact !== null}
        onClose={handleCloseSheet}
      />
    </div>
  )
}