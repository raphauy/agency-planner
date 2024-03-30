"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { PilarDAO } from "@/services/pilar-services"
import { PublicationFormValues, publicationSchema } from '@/services/publication-services'
import { zodResolver } from "@hookform/resolvers/zod"
import { PublicationStatus } from "@prisma/client"
import { Loader, WandSparkles } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { getClientDAOBySlugAction } from "../../clients/client-actions"
import IgCarousel from "./ig-carousel"
import { createOrUpdatePostAction, getPostDAOAction } from "./publication-actions"

type Props= {
  id?: string
  closeDialog?: () => void
}

export function PostForm({ id, closeDialog }: Props) {
  const form = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      clientId: "",
      pilarId: "",
      title: "",
      copy: "",
      hashtags: "",
      status: PublicationStatus.BORRADOR,
      type: "INSTAGRAM_POST"
    },
    mode: "onChange",
  })
  const clientSlug= useParams().clientSlug as string

  const [loading, setLoading] = useState(false)
  const [clientHandle, setClientHandle] = useState("")
  const [clientImage, setClientImage] = useState("/user-placeholder.jpg")
  const [pilars, setPilars] = useState<PilarDAO[]>([])
  const statuses= Object.values(PublicationStatus)

  const [images, setImages] = useState<string[]>([])

  function addImage(image: string) {
    setImages((prevImages) => [...prevImages, image]);
  }

  function removeImage(imageUrl: string) {
    setImages((prevImages) => prevImages.filter((image) => image !== imageUrl));
  }

  useEffect(() => {
    if (!clientSlug) return

    getClientDAOBySlugAction(clientSlug)
    .then((client) => {
      if (client) {
        form.setValue("clientId", client.id)
        client.igHandle && setClientHandle(client.igHandle)
        client.image && setClientImage(client.image)
        setPilars(client.pilars)
      }
    })
    .catch((error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    })

  }, [])
  
  useEffect(() => {
    if (id) {
      getPostDAOAction(id).then((data) => {
        if (data) {
          form.reset(data)
          data.images && setImages(data.images.split(","))
          data.client.igHandle && setClientHandle(data.client.igHandle)
          data.client.image && setClientImage(data.client.image)
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null || form.getValues(key) === undefined) {
            form.setValue(key, "")
          }
        })
      })
    }
  }, [form, id])

  const onSubmit = async (data: PublicationFormValues) => {
    data.images= images.join(",")
    setLoading(true)
    try {
      await createOrUpdatePostAction(id ? id : null, data)
      toast({ title: id ? "Post actualizado" : "Post creado" })
      closeDialog && closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className='p-4 m-4 bg-white border rounded-3xl min-w-[380px] max-w-[500px]'>

      {/* Header */}
      <div className='flex items-center'>
        <div className="relative inline-block w-8 h-8 overflow-hidden border rounded-full md:h-11 md:w-11">
        
        <Image src={clientImage} alt="Client's logo" width={100} height={100} />
        </div>
        <p className='pl-2 text-sm font-semibold'>{clientHandle}</p>
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
                  <Input placeholder="Título del post" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="copy"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormLabel className="flex-1">Copy:</FormLabel>
                  <Button type="button" variant="ghost">
                    <WandSparkles />
                  </Button>                  
                </div>
                <FormControl>
                  <Textarea rows={12} placeholder={`Para generar un copy basado en el título toca el botoncito 👆🏼 mágico. Se tendrá en cuenta además del título, los posts anteriores de este mismo pilar de contenido.`} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />         

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
            <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Guardar</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

