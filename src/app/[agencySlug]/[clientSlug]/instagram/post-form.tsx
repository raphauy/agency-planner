"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { ClientDAO } from "@/services/client-services"
import { PilarDAO } from "@/services/pilar-services"
import { PublicationFormValues, publicationSchema } from '@/services/publication-services'
import { zodResolver } from "@hookform/resolvers/zod"
import { PublicationStatus } from "@prisma/client"
import { useCompletion } from "ai/react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Loader, SparklesIcon, Trash2, X } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import { getClientDAOBySlugAction } from "../../clients/client-actions"
import { deletePublicationAction } from "../publications/publication-actions"
import IgCarousel from "./ig-carousel"
import { createOrUpdatePostAction, getPostDAOAction } from "./publication-actions"

type Props= {
  id?: string
  closeDialog?: () => void
}

export function PostForm({ id, closeDialog }: Props) {
  const router= useRouter()

  const form = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      clientId: "",
      pilarId: "",
      title: "",
      copy: "",
      hashtags: "",
      status: PublicationStatus.BORRADOR,
      type: "INSTAGRAM_POST",
      publicationDate: undefined,
    },
    mode: "onChange",
  })
  const agencySlug= useParams().agencySlug as string
  const clientSlug= useParams().clientSlug as string

  const [loading, setLoading] = useState(false)
  const [openCalendar, setOpenCalendar] = useState(false)
  const [client, setClient] = useState<ClientDAO>()
  const [clientImage, setClientImage] = useState("/user-placeholder.jpg")
  const [pilars, setPilars] = useState<PilarDAO[]>([])
  const statuses= Object.values(PublicationStatus)
  const [images, setImages] = useState<string[]>([])
  const [copy, setCopy] = useState("")
  const [title, setTitle] = useState("")

  const { complete, completion,	input, isLoading, handleInputChange, setInput } = useCompletion({
		onFinish: (prompt, completion) => {
      setCopy(completion.trim())
      setInput("")
    },
		onError: (error) => toast({ title: "Error", description: "Algo salió mal!", variant: "destructive" }),
	});

  function addImage(image: string) {
    setImages((prevImages) => [...prevImages, image]);
  }

  function removeImage(imageUrl: string) {
    setImages((prevImages) => prevImages.filter((image) => image !== imageUrl));
  }

  useEffect(() => {
    console.log("changing...");
    
    if (!copy) {
      setInput(client?.copyPrompt || "")
    }
      
    }, [setInput, copy, client?.copyPrompt])

  useEffect(() => {
    if (!clientSlug) return

    getClientDAOBySlugAction(clientSlug)
    .then((client) => {
      if (client) {
        form.setValue("clientId", client.id)
        setClient(client)
        client.image && setClientImage(client.image)
        setPilars(client.pilars)
      }
    })
    .catch((error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    })

  }, [clientSlug, form])
  
  useEffect(() => {
    if (id) {
      getPostDAOAction(id).then((data) => {
        if (data) {
          form.reset(data)
          setTitle(data.title)
          data.copy && setCopy(data.copy)
          data.images && setImages(data.images.split(","))
          data.publicationDate && form.setValue("publicationDate", data.publicationDate)
          data.client.image && setClientImage(data.client.image)
        }
      })
    }
  }, [form, id])

  const onSubmit = async (data: PublicationFormValues) => {
    data.images= images.join(",")
    data.copy= copy
    if (!data.publicationDate) {
      data.publicationDate= null    
    }
    setLoading(true)
    try {
      await createOrUpdatePostAction(id ? id : null, data)
      toast({ title: id ? "Post actualizado" : "Post creado" })
      if (closeDialog)
        closeDialog()
      else router.push(`/${agencySlug}/${clientSlug}/instagram?post=${id}`)

    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  function handleCancel() {
    if (closeDialog) {
      closeDialog()
    } else {
      router.back()
    }
  }

  function handleComplete() {
    if (!input) {
      toast({ title: "Debes escribir algo para completar", variant: "destructive" })
      return
    }

    if (!title) {
      toast({ title: "Debes escribir un título para darle info a la IA", variant: "destructive" })
      return
    }      

    complete(input, { body: { title, copy } })    
  }

  function handleSetPublicationDateToNull() {
    form.setValue("publicationDate", null)    
  }

  return (
    <div className='p-4 bg-white border rounded-3xl min-w-[380px] max-w-[500px]'>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative inline-block w-8 h-8 overflow-hidden border rounded-full md:h-11 md:w-11">            
                <Image src={clientImage} alt="Client's logo" width={100} height={100} />
              </div>
              <p className="pl-2 text-sm font-semibold">{client?.igHandle}</p>
            </div>
            {id && <DeletePublicationDialog id={id} />}
          </div>


      {/* Carousel */}
      <IgCarousel initialImages={images} addImage={addImage} removeImage={removeImage} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          
          <FormField
            control={form.control}
            name="pilarId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pilar de contenido:</FormLabel>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un Pilar de contenido" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pilars.map(pilar => (
                      <SelectItem key={pilar.id} value={pilar.id}>{pilar.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Título:</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    onChange={(value) => {
                      setTitle(value.target.value)                     
                      field.onChange(value)
                    }}
                    placeholder="Título del post" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col items-center md:justify-center min-w-full py-4 grow" >
            <FormLabel className="text-left w-full mb-4">Copy:</FormLabel>
            <TextareaAutosize
              value={isLoading && completion.length > 0 ? completion.trim() : copy }
              onChange={(e) => {
                if (!isLoading) setCopy(e.target.value);
              }}
              className="rounded-lg h-52 w-full min-w-full max-w-7xl min-h-52 md:min-w-96 drop-shadow-sm bg-gray-100 border border-gray-200 px-2 pt-2 pb-6 md:resize-y dark:bg-gray-900 dark:border-gray-800 focus:outline-none focus:border-blue-300 dark:focus:border-blue-700 transition-colors max-h-[52rem]"
              placeholder="escribe aquí o utiliza la magia de abajo..."
              aria-label="Text"
              cacheMeasurements
            />

            <div className="rounded-full w-10/12 justify-between drop-shadow-sm bg-white border border-gray-200 -mt-5 dark:bg-gray-900 dark:border-gray-800 flex focus-within:border-blue-300 dark:focus-within:border-blue-700 transition-colors">
              <input
                disabled={isLoading}
                className="bg-white dark:bg-gray-900 w-full rounded-full py-1 px-3 focus:outline-none"
                placeholder={cn(copy === "" ? "Escribe el copy..." : "Reescribe en tono más profesional")}
                onChange={handleInputChange}
                value={input}
                aria-label="Prompt"
                required
                onKeyDown={
                  (e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleComplete()
                    }
                  }
                }
              />

              <button
                aria-label="Button"
                type="button"
                className="rounded-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-colors text-white size-8 md:size-10 flex items-center justify-center"
                onClick={handleComplete}
              >
                {isLoading ? <Loader className="animate-spin w-10" /> : <SparklesIcon className="w-10" />}
              </button>
            </div>

          </div>

          <FormField
            control={form.control}
            name="hashtags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hashtags:</FormLabel>
                <FormControl>
                  <Textarea rows={6} placeholder="hashtags..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publicationDate"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel className="mt-1.5">Fecha de publicación:</FormLabel>
                <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona la fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      onSelect={(date) => {
                        field.onChange(date);
                        setOpenCalendar(false)
                      }}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" onClick={handleSetPublicationDateToNull} disabled={!field.value}>
                      <X />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Quitar fecha</p>
                  </TooltipContent>
                </Tooltip>
              </FormItem>
            )}
          />
      
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado:</FormLabel>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un Pilar de contenido" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

        <div className="flex justify-end">
            <Button onClick={handleCancel} type="button" variant={"secondary"} className="w-32">Cancel</Button>
            <Button type="button" className="w-32 ml-2" onClick={form.handleSubmit(onSubmit)}>
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Guardar</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}




export function DeletePublicationForm({ id, closeDialog }: Props) {
  const [loading, setLoading] = useState(false)

  const router= useRouter()
  const agencySlug= useParams().agencySlug as string
  const clientSlug= useParams().clientSlug as string

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deletePublicationAction(id)
    .then(() => {
      toast({title: "Publication eliminada" })
      router.push(`/${agencySlug}/${clientSlug}/instagram`)
    })
    .catch((error) => {
      toast({title: "Error", description: error.message, variant: "destructive"})
    })
    .finally(() => {
      setLoading(false)
      closeDialog && closeDialog()
    })
  }
  
  return (
    <div>
      <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
      <Button onClick={handleDelete} variant="destructive" className="w-32 ml-2 gap-1">
        { loading && <Loader className="h-4 w-4 animate-spin" /> }
        Delete  
      </Button>
    </div>
  )
}

type DeleteProps= {
  id: string
}

export function DeletePublicationDialog({ id }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer text-red-500"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar publicación</DialogTitle>
          <DialogDescription className="py-8">Seguro que deseas eliminar este post?</DialogDescription>
        </DialogHeader>
        <DeletePublicationForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}
