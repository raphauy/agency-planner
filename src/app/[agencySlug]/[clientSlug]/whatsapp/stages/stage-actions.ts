"use server"
  
import { revalidatePath } from "next/cache"
import { StageDAO, StageFormValues, createStage, updateStage, getStageDAO, deleteStage, KanbanStageDAO, updateKanbanStages } from "@/services/stage-services"


export async function getStageDAOAction(id: string): Promise<StageDAO | null> {
    return getStageDAO(id)
}

export async function createOrUpdateStageAction(id: string | null, data: StageFormValues): Promise<StageDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateStage(id, data)
    } else {
        updated= await createStage(data)
    }     

    revalidatePath("/client/[slug]/crm", "page")

    return updated as StageDAO
}

export async function deleteStageAction(id: string): Promise<StageDAO | null> {    
    const deleted= await deleteStage(id)

    revalidatePath("/client/[slug]/crm", "page")

    return deleted as StageDAO
}

export async function updateKanbanStagesAction(clientId: string, stages: KanbanStageDAO[]) {
    const updated= await updateKanbanStages(clientId, stages)

    revalidatePath("/client/[slug]/crm", "page")

    return updated
}