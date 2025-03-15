"use client"

import { useState } from "react";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";
import { EllipsisVertical } from "lucide-react";
import { DeleteStageDialog, StageDialog } from "../stages/stage-dialogs";
import { cn } from "@/lib/utils";

type Props = {
    stageId: string
    stageName: string
}

export default function StageMenu({ stageId, stageName }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    return (
        <Menubar className="border-0 bg-background">
            <MenubarMenu>
                <MenubarTrigger className="px-1 cursor-pointer bg-background" onClick={handleDialogClose}>
                    <EllipsisVertical className="h-5 w-5" />
                </MenubarTrigger>
                <MenubarContent className={cn("p-4 text-muted-foreground", isDialogOpen && "hidden")}>
                    <div onClick={handleDialogOpen}>
                        <StageDialog id={stageId} />
                    </div>
                    <MenubarSeparator />
                    <div onClick={handleDialogOpen}>
                        <DeleteStageDialog id={stageId} description={`Seguro que quieres eliminar el estado ${stageName}?`} />
                    </div>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}
