import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/utils";
import Logo from "@/components/header/logo";
import Selectors from "@/components/header/selectors/selectors";
import Logged from "@/components/header/logged";
import Menu from "@/components/header/menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationFeed } from "@/components/notifications-feed";

type Props = {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: Props) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return redirect("/login")
  }

  if (currentUser?.role !== "ADMIN") {
    return redirect("/auth/unauthorized?message=You are not authorized to access this page")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-48px)] w-full">
      <div className="px-3 sm:px-4 md:px-5 lg:px-3 border-b border-b-gray-300 w-full">
        <div className="flex justify-between items-center">
          <Logo />
          <Selectors />
          <NotificationFeed />
          <Logged />
        </div>
        <Menu />
      </div>

      <div className="px-3 sm:px-4 md:px-5 xl:px-3 flex flex-col items-center flex-1 w-full bg-slate-50 dark:bg-black">
        <div className="flex flex-col items-center flex-grow p-1 w-full max-w-[1350px]">
          <TooltipProvider delayDuration={0}>
          {children}
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
