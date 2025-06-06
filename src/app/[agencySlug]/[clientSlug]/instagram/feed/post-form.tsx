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
import { PublicationStatus, PublicationType } from ".prisma/client"
import { useCompletion } from "ai/react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Loader, SparklesIcon, Trash2, X } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import { getClientDAOBySlugAction } from "../../../clients/client-actions"
import { deletePublicationAction } from "../../publications/publication-actions"
import IgCarousel from "./ig-carousel"
import { createOrUpdatePostAction, getPostDAOAction } from "./publication-actions"
import { getLabel } from "./ig-box"
import { Badge } from "@/components/ui/badge"

type Props= {
  id?: string
  type?: PublicationType
  defaultHashtags: string
  cloudinaryPreset: string
  cloudName: string
}

export function PostForm({ id, type: typeProp, defaultHashtags, cloudinaryPreset, cloudName }: Props) {
  
  const router= useRouter()

  const form = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      clientId: "",
      pilarId: "",
      title: "",
      copy: "",
      hashtags: defaultHashtags,
      status: PublicationStatus.BORRADOR,
      type: typeProp || PublicationType.INSTAGRAM_POST,
      publicationDate: undefined,
    },
    mode: "onChange",
  })
  const agencySlug= useParams().agencySlug as string
  const clientSlug= useParams().clientSlug as string
  const searchParams = useSearchParams()
  const dateParam = searchParams.get('date')

  const [loading, setLoading] = useState(false)
  const [openCalendar, setOpenCalendar] = useState(false)
  const [client, setClient] = useState<ClientDAO>()
  const [clientImage, setClientImage] = useState("/user-placeholder.jpg")
  const [pilars, setPilars] = useState<PilarDAO[]>([])
  const statuses= Object.values(PublicationStatus)
  const [images, setImages] = useState<string[]>([])
  const [copy, setCopy] = useState("")
  const [title, setTitle] = useState("")
  const [type, setType] = useState<PublicationType>(typeProp || PublicationType.INSTAGRAM_POST)

  const { complete, completion,	input, isLoading, handleInputChange, setInput } = useCompletion({
		onFinish: (prompt, completion) => {
      setCopy(completion.trim())
      setInput("")
    },
		onError: (error) => {
      console.log("Error:", error)
      
      toast({ title: "Error", description: "Algo salió mal!", variant: "destructive" })
    },
	});

  function addImage(image: string) {
    setImages((prevImages) => [...prevImages, image]);
  }

  function removeImage(imageUrl: string) {
    setImages((prevImages) => prevImages.filter((image) => image !== imageUrl));
  }

  useEffect(() => {
    if (!type) return

    form.setValue("type", type)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])
  

  useEffect(() => {
    if (!copy) {
      setInput(client?.copyPrompt || "")
    }
      
    }, [setInput, copy, client?.copyPrompt])

  useEffect(() => {
    if (!clientSlug) return

    getClientDAOBySlugAction(agencySlug, clientSlug)
    .then((client) => {
      if (client) {
        form.setValue("clientId", client.id)
        setClient(client)
        client.image && setClientImage(client.image)
        setPilars(client.pilars)
        const firstPilar= client.pilars?.[0]
        if (firstPilar) {
          form.setValue("pilarId", firstPilar.id)
        }
      }
    })
    .catch((error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    })

  }, [clientSlug, agencySlug, form])
  
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
          setType(data.type)
        }
      })
    }
  }, [form, id])

  useEffect(() => {
    // Si hay un parámetro de fecha en la URL, establecerlo en el formulario
    if (dateParam) {
      try {
        const date = new Date(dateParam)
        if (!isNaN(date.getTime())) {
          form.setValue("publicationDate", date)
        }
      } catch (error) {
        console.error("Error parsing date from URL parameter:", error)
      }
    }
  }, [dateParam, form]);

  const onSubmit = async (data: PublicationFormValues) => {
    data.images= images.join(",")
    data.copy= copy
    if (!data.publicationDate) {
      data.publicationDate= null    
    }
    setLoading(true)
    try {
      const updated= await createOrUpdatePostAction(id ? id : null, data)
      if (updated) {
        toast({ title: id ? "Publicación actualizada" : "Publicación creada" })

        const page= updated.type === "INSTAGRAM_POST" ? "posts" : updated.type === "INSTAGRAM_REEL" ? "reels" : updated.type === "INSTAGRAM_STORY" ? "historias" : "feed"
        router.push(`/${agencySlug}/${clientSlug}/instagram/${page}?post=${updated.id}`)
      } else {
        toast({ title: "Error", description: "Hubo un error al guardar la publicación", variant: "destructive" })
      }

    } catch (error: any) {
      toast({ title: "Error", description: "Hubo un error al guardar la publicación", variant: "destructive" })
    } finally {
      setLoading(false)
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

    console.log("Título:", title, copy);
    

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
            <div className="flex items-center">
              <Badge>{getLabel(form.getValues("type"))}</Badge>
              {id && <DeletePublicationDialog id={id} />}
            </div>
          </div>


      {/* Carousel */}
      <IgCarousel initialImages={images} addImage={addImage} removeImage={removeImage} cloudinaryPreset={cloudinaryPreset} cloudName={cloudName} clientSlug={clientSlug} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">

          {
            form.getValues("type") === PublicationType.INSTAGRAM_REEL &&
            <p className="font-bold mb-3">* La primera imagen que subas será la portada del Reel.</p>
          }

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

          {
            type !== "INSTAGRAM_STORY" &&
              <>
              <div className="flex flex-col items-center md:justify-center min-w-full py-4 grow" >
                <FormLabel className="text-left w-full mb-4">Copy:</FormLabel>
                <TextareaAutosize
                  value={isLoading && completion.length > 0 ? completion.trim() : copy }
                  onChange={(e) => {
                    if (!isLoading) setCopy(e.target.value);
                  }}
                  className="rounded-lg h-52 w-full min-w-full max-w-7xl min-h-52 md:min-w-96 drop-shadow-sm bg-slate-50 border border-gray-200 px-2 pt-2 pb-6 md:resize-y dark:bg-gray-900 dark:border-gray-800 focus:outline-none focus:border-blue-300 dark:focus:border-blue-700 transition-colors max-h-[52rem] text-gray-800 dark:text-white"
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
            </>
            }

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
            <Button onClick={() => router.back()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
            <Button type="button" className="w-32 ml-2" onClick={form.handleSubmit(onSubmit)}>
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Guardar</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}


type DeleteFormProps= {
  id: string
  closeDialog: () => void
}

export function DeletePublicationForm({ id, closeDialog }: DeleteFormProps) {
  const [loading, setLoading] = useState(false)

  const router= useRouter()
  const agencySlug= useParams().agencySlug as string
  const clientSlug= useParams().clientSlug as string

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    
    try {
      const deleted= await deletePublicationAction(id)
      if (deleted) {
        toast({ title: "Publicación eliminada" })
        const type= deleted.type
        const page= type === "INSTAGRAM_POST" ? "posts" : type === "INSTAGRAM_REEL" ? "reels" : type === "INSTAGRAM_STORY" ? "historias" : "feed"
        router.push(`/${agencySlug}/${clientSlug}/instagram/${page}?post=${deleted.id}`)
      } else {
        toast({ title: "Error", description: "Hubo un error al eliminar la publicación", variant: "destructive" })
      }

    } catch (error: any) {
      toast({ title: "Error", description: "Hubo un error al eliminar la publicación", variant: "destructive" })
    } finally {
      setLoading(false)
    }
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
          <DialogDescription className="py-8">Seguro que deseas eliminar esta publicación?</DialogDescription>
        </DialogHeader>
        <DeletePublicationForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}
