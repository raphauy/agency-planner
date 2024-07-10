import { prisma } from "@/lib/db"
import { ClientDAO, getClientDAOBySlug } from "./client-services"

async function main() {
    console.log('main')

    const client= await getClientDAOBySlug("vinos-del-mundo")
    if (!client) {
        console.log("client not found")
        return
    }
    console.log(client?.name)

    // await updatePublicationsUsage(client.id)
}

//main()

