"use client"

import { StageDAO } from '@/services/stage-services';
import { useEffect, useState } from 'react';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RepositoryDAO } from '@/services/repository-services';
import { setMoveToStageIdOfRepositoryAction } from '../repository-actions';

type Props = {
    repository: RepositoryDAO
    stages: StageDAO[]
}
export default function SelectStage({ repository, stages }: Props) {
    const [loading, setLoading] = useState(false)
    const [selectedStageId, setSelectedStageId] = useState<string | null>(repository.moveToStageId || null)

    useEffect(() => {
        setSelectedStageId(repository.moveToStageId || null)
    }, [repository])

    function onSelectStage(stageId: string) {   
        setLoading(true)
        setMoveToStageIdOfRepositoryAction(repository.id, stageId)
        .then(updated => {
            if (updated) setSelectedStageId(stageId)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <Select
            value={selectedStageId || undefined}
            onValueChange={onSelectStage}
        >
            <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
                {stages.map(stage => (
                    <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
};