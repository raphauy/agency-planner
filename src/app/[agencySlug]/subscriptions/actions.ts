"use server"

import { createCheckoutUrl, createStripeCustomer, generateCustomerPortalUrl } from "@/lib/stripe";
import { getAgencyDAO, setStripeCustomerId } from "@/services/agency-services";
import { createSubscriptionCustom } from "@/services/subscription-services";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function subcribeAction(priceId: string, agencyId: string, email: string) {
  const agency= await getAgencyDAO(agencyId)
  if (!agency) throw new Error("Agency not found")

  if (!priceId.startsWith("price_")) {
    await createSubscriptionCustom(agencyId, priceId)
    revalidatePath(`/${agency.slug}/subscriptions`)
    return
  }

  let stripeCustomerId= agency.stripeCustomerId
  if (!stripeCustomerId) {
    console.log("creating customer on Stripe")    
    const customer= await createStripeCustomer(email, agency.name)

    console.log(`Setting customerId: ${customer.id}`)    
    await setStripeCustomerId(agencyId, customer.id)

    stripeCustomerId= customer.id
  }

  const checkoutUrl= await createCheckoutUrl(priceId, stripeCustomerId, agency.slug, agency.id)

  redirect(checkoutUrl)

}

export async function manageSubscriptionAction(agencyId: string) {
  const agency= await getAgencyDAO(agencyId)
  if (!agency) throw new Error("Agency not found")

  let stripeCustomerId= agency.stripeCustomerId
  if (!stripeCustomerId) {
    throw new Error("No se encontró el customerId de Stripe en la agencia")
  }

  const customerPortalUrl= await generateCustomerPortalUrl(stripeCustomerId, agency.slug)

  redirect(customerPortalUrl)

}