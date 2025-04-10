import { AIIntegration } from "@/components/landing/ai-integration";
import { BenefitsSection } from "@/components/landing/benefits-section";
import ContactSection from "@/components/landing/contact-section";
import { CTA1 } from "@/components/landing/cta1";
import { Hero } from "@/components/landing/hero";
import { KeyFeatures } from "@/components/landing/key-features";
import { WorkflowSection } from "@/components/landing/workflow-section";
import { getCurrentUser } from "@/lib/utils";
import { getClientsOfCurrentUser } from "@/services/client-services";
import { signOut } from "next-auth/react";
import { Poppins } from "next/font/google";
import { redirect } from "next/navigation";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

export default async function Home() {
  const user= await getCurrentUser()

  const role= user && user.role
  if (role === "ADMIN"){
    redirect("/admin")
  }

  if (role?.startsWith("AGENCY")){
    const agencySlug= user && user.agencySlug
    redirect(`/${agencySlug}`)
  }    

  if (role?.startsWith("CLIENT")){
    const agencySlug= user && user.agencySlug
    const clients= await getClientsOfCurrentUser()
    if (clients && clients.length === 0){
      // logout
      await signOut({ redirectTo: "/sign-in" })
    }
    const clientSlug= clients && clients[0]?.slug
    redirect(`/${agencySlug}/${clientSlug}`)
  }    

  return (
    <main className="flex flex-col gap-4">
      <Hero />
      <CTA1 />
      {/* <KeyFeatures />
      <BenefitsSection />
      <WorkflowSection />
      <AIIntegration /> */}
      <ContactSection />
    </main>
)
}