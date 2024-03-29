import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { redirect } from "next/navigation";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

export default async function Home() {
  const user= await getCurrentUser()

  const role= user && user.role
  if (role === "ADMIN")
    redirect("/admin")

  const agencySlug= user && user.agencySlug

  if (role?.startsWith("AGENCY"))
    redirect(`/${agencySlug}`)

  return (
    <main className="flex flex-col gap-4 pt-10">
      {
        user && (
          <div className="flex flex-col items-center">
            <h1 className={font.className}>Welcome back, {user.name}!</h1>
            <Separator className="mb-10"/>
            <Link href="/super">
              <Button>Super</Button>
            </Link>
          </div>
        ) 
      }
    </main>
)
}