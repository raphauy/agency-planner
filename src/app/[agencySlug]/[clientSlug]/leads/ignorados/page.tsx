import { getClientDAOBySlugs } from "@/services/client-services";
import { PhoneList } from "./phone-list";
import { notFound } from "next/navigation";

type Props = {
    params: {
        agencySlug: string
        clientSlug: string
    }
}
export default async function IgnoradosPage({ params }: Props) {
    const client= await getClientDAOBySlugs(params.agencySlug, params.clientSlug)
    const initialPhones = client.ignoredNumbers || ""
    if (!client) return notFound()
    return (
        <div>
            <PhoneList clientId={client.id} initialPhones={initialPhones} />
        </div>
    )
}