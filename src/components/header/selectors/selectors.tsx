import { getAgencysDAO } from "@/services/agency-services";
import AgencySelector from "./agency-selector";
import { getCurrentRole } from "@/lib/utils";
import ClientSelector from "./client-selector";
import ChannelSelector from "./channel-selector";
import { LucideIcon } from "lucide-react";

export type SelectorData={
  slug: string,
  name: string,
  image?: string
}

export type ChannelSelectorData={
  slug: string,
  name: string,
  icon: string
}

export default async function Selectors() {
  const currentRole= await getCurrentRole()

  const agencies= await getAgencysDAO()
  const agencySelectors: SelectorData[]= agencies.map(agency => ({slug: agency.slug, name: agency.name, image: agency.image}))
  
  return (
    <div className="w-full flex items-center px-2 mt-1">
        <AgencySelector selectors={agencySelectors} />        
        <ClientSelector />
        <ChannelSelector />
    </div>
  )
}
