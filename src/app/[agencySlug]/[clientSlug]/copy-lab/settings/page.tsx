import { DescriptionForm } from "@/components/description-form";
import { IconBadge } from "@/components/icon-badge";
import { Separator } from "@/components/ui/separator";
import { getCurrentRole } from "@/lib/utils";
import { getClientDAOBySlug } from "@/services/client-services";
import { UserRole } from "@prisma/client";
import { LayoutDashboard, SparklesIcon } from "lucide-react";
import SwitchBox from "./switch-box";
import { setPromptAction } from "./actions";
import { setBrandVoiceAction, setIncludeBrandVoiceAction, setIncludeLastCopysAction } from "../../settings/actions";

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
    
    const currentRole= await getCurrentRole()
    if (currentRole === UserRole.CLIENT_ADMIN || currentRole === UserRole.CLIENT_USER)
        return <div>No puedes acceder a esta página</div>

    return (
        <>
            <div className="p-6 bg-white dark:bg-black mt-4 border rounded-lg w-full">
                <div className="grid gap-6">
                    <div className="min-w-96">
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Prompt para la IA
                            </h2>
                        </div>
                        <DescriptionForm
                            label="Prompt"
                            initialValue={client.prompt || ""}
                            id={client.id}
                            update={setPromptAction}
                        />
                        <Separator className="my-4" />


                        <div className="flex items-center gap-x-2 mt-10">
                            <IconBadge icon={SparklesIcon} />
                            <h2 className="text-xl">
                                Voz de marca
                            </h2>
                        </div>

                        <SwitchBox 
                            clientId={client.id} 
                            checked={client.includeBrandVoice} 
                            switchUpdate={setIncludeBrandVoiceAction}
                            description="Incluir voz de marca al contexto para la IA"
                            info= "Se incluirá la voz de marca para que la IA tenga más contexto sobre el tono y estilo de la marca al redactar los copys."
                        />
                        <DescriptionForm
                            label="Voz de marca"
                            initialValue={client.brandVoice || ""}
                            id={client.id}
                            update={setBrandVoiceAction}
                        />
                        {/* <Separator className="my-4" />

                        <div className="flex items-center gap-x-2 mt-10">
                            <IconBadge icon={SparklesIcon} />
                            <h2 className="text-xl">
                                Últimos copys para contexto
                            </h2>
                        </div>
                        <SwitchBox 
                            clientId={client.id} 
                            checked={client.includeLastCopys} 
                            switchUpdate={setIncludeLastCopysAction}
                            description="Incluir últimos copys en el prompt"
                            info= "Se incluirán en el prompt, los últimos copys del Pilar de Contenido seleccionado para que la IA tenga más contexto sobre los copys recientemente publicados."
                        /> */}

                    </div>
                </div> 
            </div>
        </>
    )
}
