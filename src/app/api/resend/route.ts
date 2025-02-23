import { processStripeEvent } from "@/lib/stripe";
import { processResendEvent } from "@/services/emailsend-services";
import type { NextRequest } from "next/server";
import { Webhook, WebhookRequiredHeaders } from 'svix';

export type EmailEvent = {
  type: string;
  data: {
    email_id: string;
    to: string[];
    from: string;
    subject: string;
    created_at: string;
  };
}

export async function POST(request: NextRequest) {
  console.log("Resend ENDPOINT")
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) {
    return Response.json({ success: false, message: "Webhook secret not configured" }, { status: 500 });
  }

  // Obtener el cuerpo de la petición como string
  const payload = await request.text();
  
  // Obtener las cabeceras de la firma
  const svixId = request.headers.get('svix-id');
  const svixTimestamp = request.headers.get('svix-timestamp');
  const svixSignature = request.headers.get('svix-signature');

  // Verificar que todas las cabeceras necesarias estén presentes
  if (!svixId || !svixTimestamp || !svixSignature) {
    return Response.json({ success: false, message: "Missing svix headers" }, { status: 400 });
  }

  const headers: WebhookRequiredHeaders = {
    'svix-id': svixId,
    'svix-timestamp': svixTimestamp,
    'svix-signature': svixSignature,
  };

  try {
    // Crear una instancia del webhook con el secret
    const wh = new Webhook(secret);
    
    // Verificar la firma y obtener el evento
    const evt = wh.verify(payload, headers) as EmailEvent;
    
    await processResendEvent(evt)

    return Response.json({ success: true, message: "Webhook processed successfully" });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return Response.json(
      { success: false, message: "Error verifying webhook signature" },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  return Response.json({success: true, message: "Resend endpoint is working"});
}
