import { redirect } from "next/navigation";
import { getCurrentRole, getCurrentUser } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getClientsOfCurrentUser } from "@/services/client-services";
import Menu from "@/components/header/menu";

interface Props {
  children: React.ReactNode
  params: {
    agencySlug: string
  }
}

export default async function AdminLayout({ children, params }: Props) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return redirect("/login")
  }
  const agencySlug= params.agencySlug

  const currentRole= await getCurrentRole()
  if (currentRole?.startsWith("AGENCY") || currentRole?.startsWith("CLIENT")) {
    
    if (currentUser?.agencySlug!==agencySlug) {
      return redirect("/auth/unauthorized?message=You are not authorized to access this page ss")
    }

  } else if (!currentRole?.startsWith("ADMIN")) {
    return redirect("/auth/unauthorized?message=You are not authorized to access this page dd")
  }

  return (
    <div className="flex flex-col items-center flex-grow p-1 w-full max-w-[1350px]">
      <TooltipProvider delayDuration={0}>
      {children}
      </TooltipProvider>
    </div>
  )
}
