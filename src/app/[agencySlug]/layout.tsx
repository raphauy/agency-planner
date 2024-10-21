import { redirect } from "next/navigation";
import { getCurrentRole, getCurrentUser } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getClientsOfCurrentUser } from "@/services/client-services";
import Menu from "@/components/header/menu";
import Logo from "@/components/header/logo";
import Selectors from "@/components/header/selectors/selectors";
import Logged from "@/components/header/logged";
import { NotificationFeed } from "@/components/notifications-feed";

interface Props {
  children: React.ReactNode
  params: {
    agencySlug: string
  }
}

export default async function AgencyLayout({ children, params }: Props) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return redirect("/login")
  }
  const agencySlug= params.agencySlug

  const currentRole= await getCurrentRole()
  if (currentRole?.startsWith("AGENCY") || currentRole?.startsWith("CLIENT")) {
    
    if (currentUser?.agencySlug!==agencySlug) {
      return redirect("/auth/unauthorized?message=You are not authorized to access this page (user is not in the agency)")
    }

  } else if (!currentRole?.startsWith("ADMIN")) {
    return redirect("/auth/unauthorized?message=You are not authorized to access this page dd")
  }

  return (
    <div className="flex flex-col h-full w-full text-muted-foreground">
      <div className="fixed top-0 left-0 right-0 z-10 bg-background">
        <div className="px-3 sm:px-4 md:px-5 lg:px-3 border-b border-b-gray-300 w-full">
          <div className="flex justify-between items-center">
            <Logo />
            <Selectors />
            <NotificationFeed />
            <Logged />
          </div>
          <Menu />
        </div>
      </div>

      <div className="mt-[90px] px-3 sm:px-4 md:px-5 xl:px-3 flex flex-col items-center flex-1 w-full bg-slate-50 dark:bg-black">
        <div className="flex flex-col items-center flex-grow p-1 w-full max-w-[1350px]">
          <TooltipProvider delayDuration={0}>
          {children}
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
