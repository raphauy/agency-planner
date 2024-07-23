import { prisma } from "@/lib/db"
import { ClientDAO, getClientDAOBySlug } from "./client-services"
import { getPaymentMethod } from "@/lib/stripe"

async function main() {
    console.log('main')

    const subscriptionId= "sub_1Pf0S8IdkvWuNZ3Oi4OmAYrN"
    const paymentMethod= await getPaymentMethod(subscriptionId)
    console.log("paymentMethod", paymentMethod)   
    
}

//main()
