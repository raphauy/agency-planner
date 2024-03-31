import { IconBadge } from "@/components/icon-badge";
import { TitleForm } from "@/components/title-form";
import { getClientDAO, getClientDAOBySlug } from "@/services/client-services";
import { LayoutDashboard } from "lucide-react";
import { setClientDescriptionAction, setClientImageAction, setClientNameAction, setClientSlugAction } from "./actions";
import { DescriptionForm } from "@/components/description-form";
import { SlugForm } from "@/components/slug-form";
import { ImageForm } from "@/components/image-form";

type Props = {
    params: {
        agencySlug: string
        clientSlug: string
    }
}

export default async function SettingsPage({ params }: Props) {
    const clientSlug = params.clientSlug
    const client= await getClientDAOBySlug(clientSlug)
    if (!client) return <div>Client not found</div>
    return (
        <div className="p-6 bg-white mt-4 border rounded-lg w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="min-w-96">
                    <div className="flex items-center gap-x-2">
                    <IconBadge icon={LayoutDashboard} />
                    <h2 className="text-xl">
                        Información del cliente
                    </h2>
                    </div>
                    <TitleForm
                        label="Nombre del cliente"
                        initialValue={client.name}
                        id={client.id}
                        update={setClientNameAction}
                    />
                    <DescriptionForm
                        label="Descripción"
                        initialValue={client.description || ""}
                        id={client.id}
                        update={setClientDescriptionAction}
                    />
                    <ImageForm
                        id={client.id}
                        initialImage={client.image || ""}
                        update={setClientImageAction}
                    />
                    <SlugForm
                        initialValue={client.slug}
                        id={client.id}
                        update={setClientSlugAction}
                    />
                </div>
            </div> 
        </div>
    )
}
