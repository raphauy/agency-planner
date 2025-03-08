import { getDocumentDAO } from "@/services/document-services";
import ContentViewer from "./content-viewer";

type Props = {
    params: Promise<{
        docId: string
    }>
}
export default async function ArticlePreview(props: Props) {
    const params = await props.params;
    const docId= params.docId

    const doc = await getDocumentDAO(docId)
    if (!doc) {
        return <div>Documento no encontrado</div>
    }

    let content= doc.jsonContent
    if (!content) {
        content = { type: 'doc', content: [] };
    }
    // console.log("content", content)

    return (
        <div className="flex flex-col items-center p-1 md:p-4 xl:p-8">

            <p className="mb-4 text-3xl font-bold">{doc.name}</p>

            <ContentViewer content={content} className="w-full h-full p-4 bg-background"/>

        </div>
  )
}
