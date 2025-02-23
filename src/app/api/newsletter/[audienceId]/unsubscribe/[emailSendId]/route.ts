import { getAudienceDAO, unsubscribeEmail } from "@/services/audience-services";
import { getEmailSendDAO } from "@/services/emailsend-services";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";


//export async function POST(request: Request, { params }: { params: { clientId: string } }) {
type Params = {
  audienceId: string
  emailSendId: string
}
export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { audienceId, emailSendId } = params
  let unsubscribeSuccess = false
  let email = ""
  const emailSend = await getEmailSendDAO(emailSendId)
  if (emailSend) {
    email = emailSend.to
    unsubscribeSuccess = await unsubscribeEmail(audienceId, email)
  }

  const audience = await getAudienceDAO(audienceId)
  const audienceName = audience?.name || "la lista de correo"

  const html = `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${unsubscribeSuccess ? 'Baja Confirmada' : 'Error en Baja'}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  </head>
  <body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      ${unsubscribeSuccess 
        ? `<svg class="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">¡Baja Confirmada!</h2>
          <p class="text-gray-600 mb-6">Tu email <span class="font-semibold">${email}</span> ha sido dado de baja exitosamente de ${audienceName}.</p>`
        : `<svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Error al Procesar la Baja</h2>
          <p class="text-gray-600 mb-6">Lo sentimos, hubo un problema al procesar tu solicitud de baja. Por favor, intenta nuevamente más tarde.</p>`
      }
    </div>
  </body>
  </html>`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}
