import { DocumentDAO } from "@/services/document-services"
import { DocumentCard } from "./document-card"
import { DocumentType } from "@prisma/client"

type Props= {
  documents: DocumentDAO[]
  type: DocumentType
}
export default function DocumentGrid({ documents, type }: Props) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full mt-4">
      {
        documents.map(document => (
          <DocumentCard key={document.id} document={document} type={type} />
        ))
      }
    </div>
  )
}
