import { DescriptionForm } from "@/components/description-form";
import { IconBadge } from "@/components/icon-badge";
import { ImageForm } from "@/components/image-form";
import { SlugForm } from "@/components/slug-form";
import { TitleForm } from "@/components/title-form";
import { Button } from "@/components/ui/button";
import { getCurrentRole } from "@/lib/utils";
import { getClientDAOBySlugs } from "@/services/client-services";
import { UserRole } from "@prisma/client";
import { LayoutDashboard, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { DeleteClientDialog } from "../../clients/client-dialogs";
import { setClientDescriptionAction, setClientImageAction, setClientNameAction, setClientSlugAction, setCopyPromptAction, setDefaultHashtagsAction } from "./actions";

type Props = {
    params: {
        agencySlug: string
        clientSlug: string
    }
}

export default async function SettingsPage({ params }: Props) {
    const agencySlug= params.agencySlug as string
    const clientSlug = params.clientSlug
    const client= await getClientDAOBySlugs(agencySlug, clientSlug)
    if (!client) return <div>Client not found</div>
    
    const currentRole= await getCurrentRole()
    if (currentRole === UserRole.CLIENT_ADMIN || currentRole === UserRole.CLIENT_USER)
        return <div>No puedes acceder a esta página</div>

    return (
        <>
            <div className="p-6 bg-white dark:bg-black mt-4 border rounded-lg w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="min-w-96">
                        <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">
                            Información del cliente
                        </h2>
                        </div>
                        <TitleForm
                            label="Nombre"
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
                    <div className="min-w-96">
                        <div className="flex items-center gap-x-2">
                        <IconBadge icon={SparklesIcon} />
                        <h2 className="text-xl">
                            Prompt rápido para la creación de una publicación
                        </h2>
                        </div>
                        <DescriptionForm
                            label="Prompt para el copy"
                            initialValue={client.copyPrompt || ""}
                            id={client.id}
                            update={setCopyPromptAction}
                        />
                        <p>Este prompt se utilizará para la creación de una publicación.</p>
                        <div className="flex items-center gap-x-2">
                            <p>Para copys más elaborados puedes utilizar </p>
                            <Link href="copy-lab">
                                <Button variant="link" className="px-0">Copy Lab</Button>
                            </Link>
                        </div>

                        <DescriptionForm
                            label="Hashtags por defecto"
                            initialValue={client.defaultHashtags || ""}
                            id={client.id}
                            update={setDefaultHashtagsAction}
                        />                        
                    </div>
                </div> 
            </div>
            <div className="flex justify-center w-full mt-10">
                <DeleteClientDialog 
                    id={client.id} 
                    description={`Seguro que quieres eliminar el cliente ${client.name}`} 
                    withText={true}
                />
            </div>
            <p className="mt-5">Client ID: {client.id}</p>
        </>
    )
}
