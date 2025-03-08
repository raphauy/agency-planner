import { getClientDAOBySlugs } from "@/services/client-services";
import { PhoneList } from "./phone-list";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{
        agencySlug: string
        clientSlug: string
    }>
}
export default async function IgnoradosPage(props: Props) {
    const params = await props.params;
    const client= await getClientDAOBySlugs(params.agencySlug, params.clientSlug)
    const initialPhones = client.ignoredNumbers || ""
    if (!client) return notFound()
    return (
        <div>
            <PhoneList clientId={client.id} initialPhones={initialPhones} />
        </div>
    )
}