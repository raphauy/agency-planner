import { redirect } from "next/navigation";
import SideBar from "./side-bar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCurrentUser } from "@/lib/utils";
import { getClientDAOBySlug } from "@/services/client-services";
import "./prosemirror.css";

type Props= {
  children: React.ReactNode
  params: {
    agencySlug: string
    clientSlug: string
  }
}

export default async function SlugLayout({ children, params }: Props) {
  const currentUser = await getCurrentUser()
  const clientSlug = params.clientSlug
  const agencySlug = params.agencySlug

  if (!currentUser) {
    return redirect("/unauthorized?message=Deberías estar logueado.")
  }

  if (currentUser.role !== 'ADMIN' && !currentUser.role.startsWith("AGENCY_"))
    return redirect("/unauthorized?message=No estas autorizado a acceder a esta página!")

  let client= await getClientDAOBySlug(clientSlug)
  if (!client) 
    return <div>Cliente no encontrado</div>
  
  return (
    <>
      <div className="flex flex-grow w-full">
        <SideBar agencySlug={agencySlug} clientSlug={clientSlug} />
        <div className="flex flex-col items-center flex-grow p-1">
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </div>
      </div>
    </>
  )
}
