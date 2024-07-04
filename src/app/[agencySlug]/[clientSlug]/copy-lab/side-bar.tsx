"use client"

import { cn } from "@/lib/utils";
import { BookOpen, Bot, ChevronRightSquare, LayoutDashboard, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  agencySlug: string
  clientSlug: string
}
export default function SideBar({ agencySlug, clientSlug }: Props) {

  const data= [
    {
      href: `/${agencySlug}/${clientSlug}/copy-lab/documents`,
      icon: BookOpen,
      text: "Documentos"
    },
    {
      href: "divider", icon: User
    },
    {
      href: `/${agencySlug}/${clientSlug}/prompt`,
      icon: ChevronRightSquare,
      text: "Prompt"
    },
    {
      href: "divider", icon: User
    },
    {
      href: `/${agencySlug}/${clientSlug}/copy-lab/assistant`,
      icon: Bot,
      text: "Asistente"
    },
    {
      href: "divider", icon: User
    },
  ]

  const path= usePathname()

  const commonClasses= "flex gap-2 items-center py-1 mx-2 rounded hover:bg-gray-200 dark:hover:text-black"
  const selectedClasses= "font-bold text-osom-color dark:border-r-white"

  return (
    <div className="flex flex-col justify-between border border-r-osom-color/50 bg-white dark:bg-black pl-1">
      <section className="flex flex-col gap-3 py-4 mt-3 ">
        {data.map(({ href, icon: Icon, text }, index) => {
          if (href === "divider") return divider(index)
          
          const selected= path.endsWith(href)
          const classes= cn(commonClasses, selected && selectedClasses)
          return (
            <Link href={href} key={href} className={classes} prefetch={false}>
              <div className="pb-1">
                <Icon />
              </div>
              <p className="md:block md:w-36">{text}</p>                  
            </Link>
          )
        })}



      </section>
    </div>
  );
}


function divider(key?: number) {
  return <div key={key} className="mx-2 my-5 border-b border-b-osom-color/50" />
}
