import { getAgencyDAOBySlug } from "@/services/agency-services"
import { getClientDAOBySlug } from "@/services/client-services"
import { redirect } from "next/navigation"
import IgPost from "./ig-post"
import { PostForm } from "./post-form"

type Props = {
    params: {
        agencySlug: string
        clientSlug: string
    }
}

export default async function InstagramPage({ params }: Props) {
    const { agencySlug, clientSlug } = params
    const agency= await getAgencyDAOBySlug(agencySlug)
    const client= await getClientDAOBySlug(clientSlug)
    if (!agency || !client) {
      redirect("/auth/404")
    }
  
    return (
      <div className="space-y-2">

        {/* <div className="border mt-5 rounded-lg bg-white p-10 space-y-3">
          <h1 className="text-xl font-bold">Instagram Page</h1>
          <p>Agency: {agency.name}</p>
          <p>Client: {client.name}</p>

        </div> */}
        {/* <IgPost initialImages={[]} /> */}

        <PostForm />
      </div>
    )
}
    