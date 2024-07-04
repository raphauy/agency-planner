import { getDocumentDAO } from "@/services/document-services";
import { redirect } from "next/navigation";
import { DocumentDialog } from "../document-dialogs";
import NovelOnClient from "./editor-on-client";

type Props = {
    params: {
        agencySlug: string
        clientSlug: string
        documentId: string
    }
}
export default async function Page({ params }: Props) {
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
        redirect(`/${agencySlug}/${clientSlug}/copy-lab/documents`)
    }

    const BASE_PATH= process.env.NEXTAUTH_URL

    return (
        <div className="flex flex-col w-full p-1 md:p-4 xl:p-8">
                        
            <div className="flex items-center justify-center gap-4 mb-4">
                <p className="text-3xl font-bold">{document.name}</p>
                <DocumentDialog id={document.id} clientId={document.clientId} />
            </div>

            <NovelOnClient document={document} initialContent={content} />

        </div>
    )
}

const defaultContent = {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Soy un título 2" }],
      },
      {
        type: "paragraph",
        content: [
            {
                type: "text",
                text: "Este es un editor al estilo de Notion con autocompletado impulsado por IA.",
            },
        ],
      },
      {
        type: "paragraph",
        content: [
            {
                type: "text",
                text: "Prueba digitando la barra diagonal / al inicio de un párrafo para ver las opciones de autocompletado. También puedes escribir ++ para que la IA te complete una frase.",
            },
        ],
      },   
    ],
  };