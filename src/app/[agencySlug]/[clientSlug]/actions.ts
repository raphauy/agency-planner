"use server"

import { SelectorData } from "@/components/header/selectors/selectors";
import { getFunctionalitiesByClientSlug } from "@/services/functionality-services";


export async function getFunctionalitiesSelectorsOfCurrentClientAction(clientSlug: string): Promise<SelectorData[]> {

    const functionalities= await getFunctionalitiesByClientSlug(clientSlug)
    const selectors= functionalities.map(f => {
        return {
            name: f.name,
            slug: f.slug,
            image: f.image
        }
    })

    return selectors
}
