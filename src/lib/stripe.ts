import { getAgencyDAO, getAgencyDAOByStripeCustomerId } from "@/services/agency-services";
import { getPlanDAOByPriceId } from "@/services/plan-services";
import { changePlan, createSubscription, getSubscriptionDAOByStripeSubscriptionId, SubscriptionFormValues, SubscriptionUpdateFormValues, updateSubscription } from "@/services/subscription-services";
import { Subscription, SubscriptionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
    typescript: true,
})

export async function createStripeCustomer(email: string, agencyName: string) {
    const customer = await stripe.customers.create({
        email,
        name: agencyName,        
    })

    return customer
}

export async function generateCustomerPortalUrl(stripeCustomerId: string, agencySlug: string) {
    const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_URL}/${agencySlug}/subscriptions`,        
    });

    return portalSession.url;
}

export async function createCheckoutUrl(priceId: string, stripeCustomerId: string, agencySlug: string, agencyId: string) {
    const billingCicleAnchor= getBillingCicleAnchor()
    const checkout = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: stripeCustomerId,        
        line_items: [
            {
                price: priceId,
                quantity: 1
            }
        ],
        subscription_data: {
            billing_cycle_anchor: billingCicleAnchor,
            proration_behavior: "create_prorations",
            metadata: {
                agencyId,
                agencySlug,
                priceId
            }
        },
        success_url: `${process.env.NEXT_PUBLIC_URL}/${agencySlug}/subscriptions?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/${agencySlug}/subscriptions?success=false`
    })

    if (!checkout.url) {
        throw new Error("Hubo un error al crear el checkout")
    }

    return checkout.url;
}


export async function processStripeEvent(body: string | Buffer, signature: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET    
    if (!endpointSecret) {
        throw new Error("WHSEC not found")
    }

    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    if (!event) {
        throw new Error("Hubo un error al procesar el evento")
    }

    console.log("[EVENT]", event.type)

    switch (event.type) {
        case "customer.subscription.created":            

            const createdSubscription= event.data.object as Stripe.Subscription
            console.log("createdSubscription:")
            //console.log(createdSubscription)
            
            const stripePeriodEnd= new Date(createdSubscription.current_period_end * 1000)

            const agencyId= createdSubscription.metadata.agencyId as string
            const agency= await getAgencyDAO(agencyId)
            if (!agency) {
                console.log("Agency not found on webhook")
                return
            }
            const priceId= createdSubscription.metadata.priceId as string
            const plan= await getPlanDAOByPriceId(priceId)
            if (!plan) {
                console.log("Plan not found on webhook with priceId", priceId)
                return
            }

            const stripeCustomer= await stripe.customers.retrieve(createdSubscription.customer as string) as Stripe.Customer
            const stripeCustomerEmail= stripeCustomer.email as string
            const stripePaymentMethod= await getPaymentMethod(createdSubscription.id) as string

            const subscriptionValues: SubscriptionFormValues= {
                planId: plan.id,
                agencyId,
                stripeSubscriptionId: createdSubscription.id,
                stripeCustomerEmail,
                stripePaymentMethod,
                stripePeriodEnd,
                planName: plan.name,
                planDescription: plan.description,
                planPrice: plan.price,
                planCurrency: plan.currency,
                maxClients: plan.maxClients,
                maxCredits: plan.maxCredits,
                maxLLMCredits: plan.maxLLMCredits,
                status: "ACTIVE",
            }

            const created= await createSubscription(subscriptionValues)
            if (created) {
                console.log(`subscription created for plan ${plan.name} and email ${stripeCustomerEmail}`)
            }

            revalidatePath(`/${agency.slug}/subscriptions`)
            
            break

        case "customer.subscription.updated":
            console.log("customer.subscription.updated")
            const stripeSubscription= event.data.object as Stripe.Subscription
            console.log(stripeSubscription);
            const subscription= await getSubscriptionDAOByStripeSubscriptionId(stripeSubscription.id)
            if (!subscription) {
                console.log(`No se encontro la subscripcion ${stripeSubscription.id}`)
                return
            }
            const updatedPeriodEnd= new Date(stripeSubscription.current_period_end * 1000)
            console.log("updatedPeriodEnd", updatedPeriodEnd)

            let status: SubscriptionStatus= "ACTIVE"
            let canceledAt= undefined
            if (stripeSubscription.cancel_at_period_end) {
                status= "CANCELLED"
                canceledAt= stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000) : undefined
            }
            const updateValues: SubscriptionUpdateFormValues= {
                stripePeriodEnd: updatedPeriodEnd,
                status,
                canceledAt,
            }
            const updatedPriceId= stripeSubscription.items.data.length > 0 ? stripeSubscription.items.data[0].plan?.id : null
            if (updatedPriceId && updatedPriceId !== subscription.plan.priceId) {
                console.log("updatedPriceId", updatedPriceId)
                console.log("subscription.plan.priceId", subscription.plan.priceId)
                const paymentMethod= await getPaymentMethod(stripeSubscription.id)
                await changePlan(subscription.id, stripeSubscription.id, updatedPriceId, updatedPeriodEnd, paymentMethod)
            } else {
                console.log("subscription plan not changed, updating values")
                await updateSubscription(subscription.id, updateValues)
            }
            break


        default:
            
    }
  
}

function getBillingCicleAnchor() {
    // Calcular el primer día del próximo mes
    const today = new Date()
    const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)

    // Si la fecha es menor a dos días en el futuro, ajustar la fecha
    const minTrialEndDate = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)
    const trialEndDate = firstDayOfNextMonth > minTrialEndDate ? firstDayOfNextMonth : minTrialEndDate

    return Math.floor(trialEndDate.getTime() / 1000)
}

export async function getPaymentMethod(subscriptionId: string) {
    // Recuperar la suscripción completa para obtener detalles adicionales
    const fullSubscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['default_payment_method']
    });

    const paymentMethod= fullSubscription.default_payment_method as Stripe.PaymentMethod

    const card= paymentMethod.card

    const res= card ? card.brand + "****" + card.last4 : ""

    return res
}