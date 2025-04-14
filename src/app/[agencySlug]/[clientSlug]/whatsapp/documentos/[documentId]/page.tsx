import { getDocumentDAO } from "@/services/document-services";
import { redirect } from "next/navigation";
import { DocumentDialog } from "../document-dialogs";
import NovelOnClient from "./editor-on-client";
import { cn, getCurrentUser } from "@/lib/utils";
import GenerateDescriptionButton from "./generate-description-button";
import { getValue } from "@/services/config-services";
import { DescriptionForm } from "@/components/description-form";
import { updateTemplateAction } from "../document-actions";

type Props = {
    params: Promise<{
        agencySlug: string
        clientSlug: string
        documentId: string
    }>
}
export default async function Page(props: Props) {
    const params = await props.params;
    const agencySlug= params.agencySlug
    const clientSlug= params.clientSlug
    const documentId= params.documentId
    const document= await getDocumentDAO(documentId)
    if (!document) {
        return <div>Document not found</div>
    }
    let content= document.jsonContent
    if (!content) {
        content= defaultContent
    }

    if (document.clientSlug !== clientSlug) {
        redirect(`/${agencySlug}/${clientSlug}/leads/documentos`)
    }

    const label= document.automaticDescription ? "generada con IA" : "manual"

    const descriptionTemplate= await getValue("DOCUMENT_DESCRIPTION_PROMPT")
    
    const currentUser= await getCurrentUser()
    const isAdmin= currentUser?.role === "ADMIN"

    return (
        <div className="flex flex-col w-full p-1 md:p-4 xl:p-8">
                        
            <div className="flex items-center justify-center gap-4 mb-4">
                <p className="text-3xl font-bold">{document.name}</p>
                <DocumentDialog id={document.id} clientId={document.clientId} type={document.type} />
            </div>

            <NovelOnClient document={document} initialContent={content} />

            <div className="gap-4 mt-10 space-y-5 mb-40">
                <p className="text-2xl font-bold">Descripción ({label})</p>
                <p className="whitespace-pre-wrap border rounded-md p-4">{document.description}</p>
                <GenerateDescriptionButton id={document.id} />

                <div className={cn(!isAdmin && "hidden")}>
                {
                    descriptionTemplate ?
                    <DescriptionForm 
                        id={"DOCUMENT_DESCRIPTION_PROMPT"} 
                        label="Descripción (este prompt se utiliza para generar la descripción automática para todos los clientes que estén en automático)"
                        initialValue={descriptionTemplate} 
                        update={updateTemplateAction} 
                    />
                    :
                    <p className="text-sm text-muted-foreground bg-background rounded-md p-2">No hay template de descripción</p>
                }
                </div>
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
                                text: "Un copy de Instagram debe ser claro y conciso, y debe ser útil para los clientes.",
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
                                text: "Un copy de Instagram debe tener un largo aproximado de 100 palabras.",
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
                                text: "Un copy de Instagram debe estar dirigido a los objetivos específicos del cliente.",
                            },
                        ],
                    },
                ],
            },
        ],
      },
    ],
  };