import CodeBlock from "@/components/code-block"
import { DescriptionForm } from "@/components/description-form"
import { IconBadge } from "@/components/icon-badge"
import { TitleForm } from "@/components/title-form"
import { getFieldsDAO } from "@/services/field-services"
import { getRepositoryDAO } from "@/services/repository-services"
import { getStagesDAO } from "@/services/stage-services"
import { Database, Tag } from "lucide-react"
import { setExecutionResponseAction, setFunctionNameAction, setNameAction, setNotifyPhonesAction } from "../repository-actions"
import { DeleteRepositoryDialog } from "../repository-dialogs"
import FieldsBox from "./fields-box"
import { FunctionDescriptionForm } from "./function-description-form"
import { HookForm } from "./hook-form"
import SelectStage from "./select-stage"
import TagInputBox from "./tag-input-function"

type Props = {
  repoId: string
}

export default async function FCConfig({ repoId }: Props) {

  const repository= await getRepositoryDAO(repoId)
  if (!repository) return <div>Repositorio no encontrado</div>

  const fields= await getFieldsDAO(repository.id)

  const stages= await getStagesDAO(repository.clientId)
  
  const BASE_PATH= process.env.NEXTAUTH_URL!

  return (
    <>
        <div className="p-6 bg-white dark:bg-black mt-4 border rounded-lg w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="min-w-96">
                    <div className="flex items-center space-x-2">
                      <IconBadge icon={Database} />
                      <h2 className="text-xl">
                          Información de la FC
                      </h2>
                    </div>

                    <TitleForm
                      label="Nombre"
                      initialValue={repository.name}
                      id={repository.id}
                      update={setNameAction}                                            
                    />

                    <TitleForm
                        label="Nombre de la función"
                        initialValue={repository.functionName}
                        id={repository.id}
                        update={setFunctionNameAction}
                    />
                    
                    <FunctionDescriptionForm repository={repository} />

                    <DescriptionForm
                        label="Respuesta al LLM luego de que esta FC se ejecute"
                        initialValue={repository.executionResponse || ""}
                        id={repository.id}
                        update={setExecutionResponseAction}
                    />

                </div>
                <div className="min-w-96">
                    <div className="flex items-center gap-x-2">
                      <IconBadge icon={Tag} />
                      <h2 className="text-xl">
                          Campos de la FC
                      </h2>
                    </div>

                    <div className="mt-6 border bg-slate-100 rounded-md p-2 dark:bg-black">
                      <FieldsBox initialFields={fields} repoId={repository.id} />
                    </div>

                    <div className="flex items-center gap-x-2 mt-6">
                      <IconBadge icon={Tag} />
                      <h2 className="text-xl">
                          Otros
                      </h2>
                    </div>

                    <TitleForm
                      label="Teléfonos a notificar"
                      initialValue={repository.notifyPhones.join(", ")}
                      id={repository.id}
                      update={setNotifyPhonesAction}                                            
                    />

                    <div className="p-4 bg-muted border rounded-md mt-6">
                      <p className="border-b pb-2 font-medium">Hook de notificación:</p>
                      {
                        repository.webHookUrl ?
                        <HookForm repoId={repository.id} initialValue={repository.webHookUrl} />
                        :
                        <HookForm repoId={repository.id} initialValue={"agregar un hook de notificación"} />
                      }
                    </div>

                    <div className="p-4 bg-muted border rounded-md mt-6">
                      <TagInputBox repoId={repository.id} initialTags={repository.tags} />
                    </div>
                    <div className="p-4 bg-muted border rounded-md mt-6">
                      <p className="font-medium border-b pb-2">Cambiar estado:</p>
                      <SelectStage repository={repository} stages={stages} />
                    </div>


                </div>
            </div> 
        </div>

        <div className="mt-4">
          <CodeBlock code={repository.functionDefinition!} showLineNumbers={true} />
        </div>

        <div className="flex justify-center w-full mt-10">
          <DeleteRepositoryDialog
            id={repository.id} 
            description={`Seguro que quieres eliminar el repositorio ${repository.name}?`}
            withText={true}
          />
        </div>
    </>
  )
}
