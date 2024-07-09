import { TooltipProvider } from "@/components/ui/tooltip";
import { getCurrentUser } from "@/lib/utils";
import { getClientDAOBySlug } from "@/services/client-services";
import { redirect } from "next/navigation";
import { CopySideBar } from "./copy-side-bar";
import "./prosemirror.css";
import { getFullConversationsByClientSlug } from "@/services/conversation-services";

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

  const conversations= await getFullConversationsByClientSlug(clientSlug)

  return (
    <>
      <div className="flex flex-grow w-full">
        <CopySideBar agencySlug={agencySlug} clientSlug={clientSlug} conversations={conversations} />
        <div className="flex flex-col items-center flex-grow">
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </div>
      </div>
    </>
  )
}
