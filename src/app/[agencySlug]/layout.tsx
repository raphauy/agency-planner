import { redirect } from "next/navigation";
import { getCurrentRole, getCurrentUser } from "@/lib/utils";

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

  const currentRole= await getCurrentRole()
  if (currentRole?.startsWith("AGENCY")) {
    const agencySlug= params.agencySlug
    if (currentUser?.agencySlug!==agencySlug) {
      return redirect("/auth/unauthorized?message=You are not authorized to access this page")
    }

  } else if (!currentRole?.startsWith("ADMIN")) {
    return redirect("/auth/unauthorized?message=You are not authorized to access this page")
  }


  return (
    <div className="flex flex-col items-center flex-grow p-1 w-full max-w-[1350px]">
      {children}
    </div>
  )
}
