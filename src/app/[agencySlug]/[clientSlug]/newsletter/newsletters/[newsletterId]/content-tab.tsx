import { getAgencyDAOBySlug } from "@/services/agency-services";
import { getNewsletterDAO, NewsletterDAO } from "@/services/newsletter-services";
import Image from "next/image";
import { BannerForm } from "./banner-form";
import NovelOnClient from "./editor-on-client";
import { NewsletterDialog } from "../newsletter-dialogs";
import { FooterForm } from "./footer-form";
import { JSONContent } from "novel";

type Props= {
  newsletter: NewsletterDAO
  clientSlug: string
  cloudinaryPreset: string
  initialContent: JSONContent
}

export default async function ContentTab({ newsletter, clientSlug, cloudinaryPreset, initialContent }: Props) {

  return (
    <div className="flex flex-col w-full p-1 md:p-4 xl:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <p className="text-3xl">Asunto:</p>
            <p className="text-3xl font-bold line-clamp-1">{newsletter.subject}</p>
          </div>
          <div><NewsletterDialog id={newsletter.id} clientId={newsletter.clientId}/></div>
        </div>
        <BannerForm newsletterId={newsletter.id} clientSlug={clientSlug} cloudinaryPreset={cloudinaryPreset} />
      </div>

      <Image className="rounded-t-lg" src={`${newsletter?.banner || "/newsletter_placeholder.svg"}`} width={1200} height={400} alt="Banner" />

      <NovelOnClient newsletter={newsletter} initialContent={initialContent} />

      <div className="mt-10">
          <FooterForm newsletterId={newsletter.id} footerText={newsletter.footerText!} linkHref={newsletter.footerLinkHref!} linkText={newsletter.footerLinkText!} />
      </div>

    </div>
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