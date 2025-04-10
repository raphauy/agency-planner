import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAgencyDAOBySlug } from "@/services/agency-services";
import { getNewsletterDAO } from "@/services/newsletter-services";
import ConfigTab from "./config-tab";
import ContentTab from "./content-tab";
import PreviewTab from "./preview-tab";
import { getDomainsDAO } from "@/services/domain-services";
import { getClientIdBySlugs } from "@/services/client-services";
import { getAudiencesDAO } from "@/services/audience-services";
import { TestEmail } from "./test-email";
import { Broadcast } from "./broadcast";

export const maxDuration= 800

type Props= {
  params: Promise<{
    agencySlug: string
    clientSlug: string
    newsletterId: string
  }>
}

export default async function NewsletterPage(props: Props) {
    const params = await props.params;

    const agency= await getAgencyDAOBySlug(params.agencySlug)
    if (!agency) {
      return <div>Agency not found</div>
    }
    const newsletter= await getNewsletterDAO(params.newsletterId)
    console.log(newsletter)

    let initialValue= newsletter.contentJson && JSON.parse(newsletter.contentJson)
    if (!initialValue) {
      initialValue= defaultContent
    }

    const cloudinaryPreset= agency.publicPreset ? agency.publicPreset : process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!

    const clientId= await getClientIdBySlugs(params.agencySlug, params.clientSlug)
    if (!clientId) {
      return <div>Client not found</div>
    }
    const domains= await getDomainsDAO(clientId)
    const audiences= await getAudiencesDAO(clientId)

    const noDomains= domains.length === 0

    return (
      <Tabs defaultValue={"content"}>
        <TabsList>
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="config">Configuración</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          <ContentTab newsletter={newsletter} clientSlug={params.clientSlug} cloudinaryPreset={cloudinaryPreset} initialContent={initialValue} />
        </TabsContent>
        <TabsContent value="preview">
          <PreviewTab newsletter={newsletter} />
        </TabsContent>
        <TabsContent value="config" className="space-y-4 max-w-xl">
          <ConfigTab newsletter={newsletter} domains={domains} audiences={audiences} />
          <TestEmail newsletter={newsletter} noDomains={noDomains} />
        </TabsContent>
        <TabsContent value="broadcast">
          <Broadcast newsletter={newsletter} noDomains={noDomains} />
        </TabsContent>
      </Tabs>
    )
}

const defaultContent = {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "Soy un título 3" }],
      },
      {
        type: "paragraph",
        content: [
            {
                type: "text",
                text: "Puedes apretar la barra '/' para ver las opciones de edición que tienes.",
            },
        ],
      },
      {
        type: "paragraph",
        content: [
            {
                type: "text",
                text: "Este es un texto de ejemplo para un documento. Puedes eliminar todo y poner el contenido que quieras.",
            },
        ],
      },
      {
        type: "bulletList",
        content: [
            {
                type: "listItem",
                content: [
                    {
                        type: "paragraph",
                        content: [
                            {
                                type: "text",
                                text: "Un newsletter debe ser claro y conciso, y debe ser útil para los clientes.",
                            },
                        ],
                    },
                ],
            },
            {
                type: "listItem",
                checked: true,
                content: [
                    {
                        type: "paragraph",
                        content: [
                            {
                                type: "text",
                                text: "Un newsletter debe tener un largo aproximado de 100 palabras.",
                            },
                        ],
                    },
                ],
            },
            {
                type: "listItem",
                checked: true,
                content: [
                    {
                        type: "paragraph",
                        content: [
                            {
                                type: "text",
                                text: "Un newsletter debe estar dirigido a los objetivos específicos del cliente.",
                            },
                        ],
                    },
                ],
            },
        ],
      },
    ],
  };