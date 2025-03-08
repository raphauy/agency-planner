import { TooltipProvider } from "@/components/ui/tooltip";
import { getCurrentUser } from "@/lib/utils";
import { getClientDAOBySlugs } from "@/services/client-services";
import { getFullConversationsBySlugs } from "@/services/conversation-services";
import { redirect } from "next/navigation";
import { CopySideBar } from "./copy-side-bar";
import "./prosemirror.css";

type Props= {
  children: React.ReactNode
  params: Promise<{
    agencySlug: string
    clientSlug: string
  }>
}

export default async function SlugLayout(props: Props) {
  const params = await props.params;

  const {
    children
  } = props;

  const currentUser = await getCurrentUser()
  const clientSlug = params.clientSlug
  const agencySlug = params.agencySlug

  if (!currentUser) {
    return redirect("/unauthorized?message=Deberías estar logueado.")
  }

  if (currentUser.role !== 'ADMIN' && !currentUser.role.startsWith("AGENCY_"))
    return redirect("/unauthorized?message=No estas autorizado a acceder a esta página!")

  let client= await getClientDAOBySlugs(agencySlug, clientSlug)
  if (!client) 
    return <div>Cliente no encontrado</div>

  const conversations= await getFullConversationsBySlugs(agencySlug, clientSlug, "COPY_LAB")

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
