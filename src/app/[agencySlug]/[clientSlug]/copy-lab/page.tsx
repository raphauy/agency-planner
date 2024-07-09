import { redirect } from "next/navigation"
import { CopySideBar } from "./copy-side-bar"
import { ChatComponent } from "./chat-component"

interface Props{
  params: {
    agencySlug: string
    clientSlug: string
  },
}
 
export default async function ClientPage({ params }: Props) {
  const agencySlug= params.agencySlug
  const clientSlug= params.clientSlug

  //redirect(`/${agencySlug}/${clientSlug}/copy-lab/assistant`)
 
  return (
    <div className="flex flex-grow w-full">
      
      
    </div>

  )
}
