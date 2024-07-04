import { redirect } from "next/navigation"

interface Props{
  params: {
    agencySlug: string
    clientSlug: string
  },
}
 
export default async function ClientPage({ params }: Props) {
  const agencySlug= params.agencySlug
  const clientSlug= params.clientSlug

  redirect(`/${agencySlug}/${clientSlug}/copy-lab/assistant`)
 
  return <div>Copy Lab</div>
}
