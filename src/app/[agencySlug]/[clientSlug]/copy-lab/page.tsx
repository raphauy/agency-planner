import { redirect } from "next/navigation"
import { CopySideBar } from "./copy-side-bar"
import { ChatComponent } from "./chat-component"

interface Props{
  params: Promise<{
    agencySlug: string
    clientSlug: string
  }>,
}
 
export default async function ClientPage(props: Props) {
  const params = await props.params;
  const agencySlug= params.agencySlug
  const clientSlug= params.clientSlug

  //redirect(`/${agencySlug}/${clientSlug}/copy-lab/assistant`)

  return (
    <div className="flex flex-grow w-full">
      
      
    </div>

  )
}
