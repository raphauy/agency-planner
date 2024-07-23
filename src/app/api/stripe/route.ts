import { processStripeEvent } from "@/lib/stripe";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
//  console.log("Stripe ENDPOINT")
  const bodyBuffer = await request.arrayBuffer();
  const bodyString = Buffer.from(bodyBuffer).toString("utf-8");
  

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return Response.json({success: false, message: "signature is required"});
  }

  try {

    await processStripeEvent(bodyString, signature)
    return Response.json({success: true, message: "event processed"});

  } catch (error) {
    console.error(error)
    const message = error instanceof Error ? error.message : error
    return new Response(`Webhook Error: ${message}`, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  return Response.json({success: true, message: "Stripe endpoint is working"});
}