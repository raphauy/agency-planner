import { getAgencysDAO } from "@/services/agency-services";
import AgencySelector from "./agency-selector";
import { getCurrentRole } from "@/lib/utils";
import ClientSelector from "./client-selector";
import FunctionalitySelector from "./functionality-selector";
import { LucideIcon } from "lucide-react";

export type SelectorData={
  slug: string,
  name: string,
  image?: string
}

export default async function Selectors() {
  const currentRole= await getCurrentRole()

  const agencies= await getAgencysDAO()
  const agencySelectors: SelectorData[]= agencies.map(agency => ({slug: agency.slug, name: agency.name, image: agency.image}))
  
  return (
    <div className="w-full flex items-center px-2 mt-1">
        <AgencySelector selectors={agencySelectors} />        
        <ClientSelector />
        <FunctionalitySelector />
    </div>
  )
}
