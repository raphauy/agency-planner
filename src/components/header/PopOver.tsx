"use client";

import * as RadixPopover from "@radix-ui/react-popover";

interface PopOverProps{
  trigger: React.ReactNode
  body: React.ReactNode
}

export default function PopOver({ trigger, body }: PopOverProps) {
  return (
    <>
      <RadixPopover.Root>
        <RadixPopover.Trigger>{trigger}</RadixPopover.Trigger>
        <RadixPopover.Portal>
          <RadixPopover.Content align="end"
            className="rounded-2xl border py-3 w-fit bg-white z-50
            shadow-md
            will-change-[transform,opacity] 
            data-[state=open]:data-[side=top]:animate-slideDownAndFade 
            data-[state=open]:data-[side=right]:animate-slideLeftAndFade 
            data-[state=open]:data-[side=bottom]:animate-slideUpAndFade 
            data-[state=open]:data-[side=left]:animate-slideRightAndFade"
            sideOffset={10}>
                {body}
            <RadixPopover.PopoverArrow />
          </RadixPopover.Content>
        </RadixPopover.Portal>
      </RadixPopover.Root>
    </>
  );
}
