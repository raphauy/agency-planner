"use server"

import { ChannelSelectorData, SelectorData } from "@/components/header/selectors/selectors";
import { getChannelsByClientSlug } from "@/services/channel-services";
import { getFunctionalitiesByClientSlug } from "@/services/functionality-services";


export async function getChannelSelectorsOfCurrentClientAction(agencySlug: string, clientSlug: string): Promise<ChannelSelectorData[]> {

    const channels= await getChannelsByClientSlug(agencySlug, clientSlug)
    const selectors= channels.map(f => {
        return {
            name: f.name,
            slug: f.slug,
            icon: f.icon
        }
    })

    return selectors
}
