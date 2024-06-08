import { DescriptionForm } from "@/components/description-form";
import { IconBadge } from "@/components/icon-badge";
import { ImageForm } from "@/components/image-form";
import { SlugForm } from "@/components/slug-form";
import { TitleForm } from "@/components/title-form";
import { getClientDAOBySlug } from "@/services/client-services";
import { LayoutDashboard, SparklesIcon } from "lucide-react";
import { DeleteClientDialog } from "../../clients/client-dialogs";
import { setBrandVoiceAction, setClientDescriptionAction, setClientImageAction, setClientNameAction, setClientSlugAction, setCopyPromptAction, setIncludeBrandVoiceAction, setIncludeLastCopysAction } from "./actions";
import SwitchBox from "./switch-box";

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
                            Inteligencia Artificial
                        </h2>
                        </div>
                        <DescriptionForm
                            label="Voz de marca"
                            initialValue={client.brandVoice || ""}
                            id={client.id}
                            update={setBrandVoiceAction}
                        />
                        <DescriptionForm
                            label="Prompt para el copy"
                            initialValue={client.copyPrompt || ""}
                            id={client.id}
                            update={setCopyPromptAction}
                        />

                        <SwitchBox 
                            clientId={client.id} 
                            checked={client.includeBrandVoice} 
                            switchUpdate={setIncludeBrandVoiceAction}
                            description="Incluir voz de marca en el prompt"
                            info= "Se incluirá la voz de marca en el prompt de los copys para que la IA tenga más contexto sobre el tono y estilo de la marca al redactar el copy."
                        />

                        <SwitchBox 
                            clientId={client.id} 
                            checked={client.includeLastCopys} 
                            switchUpdate={setIncludeLastCopysAction}
                            description="Incluir últimos copys en el prompt"
                            info= "Se incluirán en el prompt, los últimos copys del Pilar de Contenido seleccionado para que la IA tenga más contexto sobre los copys recientemente publicados."
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
