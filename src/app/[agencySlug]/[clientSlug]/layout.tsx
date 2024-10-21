import { redirect } from "next/navigation";
import { getCurrentRole, getCurrentUser } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getClientsOfCurrentUser } from "@/services/client-services";

interface Props {
  children: React.ReactNode
  params: {
    clientSlug: string
  }
}

export default async function ClientLayout({ children, params }: Props) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return redirect("/login")
  }

  const currentRole= await getCurrentRole()
  if (currentRole?.startsWith("CLIENT")) {
    
    const clientSlug= params.clientSlug
    const clients= await getClientsOfCurrentUser()
    const clientsHaveActualSlug= clients.some((client) => client.slug===clientSlug)
    if (!clientsHaveActualSlug) {
      return redirect("/auth/404")
    }
  }


  return (
    <div className="flex flex-col items-center flex-grow p-1 w-full max-w-[1350px]">
      <TooltipProvider delayDuration={0}>
        {children}
      </TooltipProvider>
    </div>
  )
}
