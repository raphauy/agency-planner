import CodeVerifyEmail from "@/components/email/verify-email";
import { Resend } from "resend";
import { getAgencyDAO } from "./agency-services";
import { getUserDAO } from "./user-services";
import { getFullClientDAO } from "./client-services";
import { getCurrentUser } from "@/lib/utils";
import InviteClientEmail from "@/components/email/client-invite-user";
import InviteAgencyEmail from "@/components/email/agency-invite-user";




export async function sendCodeEmail(agencyId: string | null | undefined, email: string, code: string) {
  let agencyName= "Agency Planner"
  let from= process.env.DEFAULT_EMAIL_FROM!
  const contactEmail= process.env.SUPPORT_EMAIL!
  let reply_to= process.env.SUPPORT_EMAIL!
  

  if (agencyId) {
    const agency= await getAgencyDAO(agencyId)
    if (agency) {
      agencyName= agency.name
      from= agency.emailFrom ? agency.emailFrom : process.env.DEFAULT_EMAIL_FROM!
      reply_to= agency.contactEmail ? agency.contactEmail : process.env.SUPPORT_EMAIL!
    }
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from,
    to: email,
    reply_to,
    subject: `Código de acceso para ${agencyName} en Agency Planner`,
    react: CodeVerifyEmail({ 
      validationCode: code,
      sotreName: agencyName, 
      contactEmail,
    }),
  });

  if (error) {
    console.log("Error sending test email")    
    console.log("error.name:", error.name)    
    console.log("error.message:", error.message)
    return false
  } else {
    console.log("email result: ", data)
  }
}

export async function sendClientInvitationEmail(userId: string, clientId: string) {
  const invitedUser= await getUserDAO(userId)
  const client= await getFullClientDAO(clientId)
  const currentUser= await getCurrentUser()
  if (!currentUser) 
    throw new Error("No se encontró el usuario logueado")

  let from= process.env.DEFAULT_EMAIL_FROM!
  let reply_to= process.env.SUPPORT_EMAIL!
  

  const agencyId= currentUser?.agencyId
  if (agencyId) {
    const agency= await getAgencyDAO(agencyId)
    if (agency) {
      from= agency.emailFrom ? agency.emailFrom : process.env.DEFAULT_EMAIL_FROM!
      reply_to= agency.contactEmail ? agency.contactEmail : process.env.SUPPORT_EMAIL!
    }
  }

  const invitedByUsername= currentUser.name ? `${currentUser.name}` : `${currentUser.email}`
  const isProduction= process.env.NODE_ENV === "production"
  const baseURL= client.agency.domain ? `https://${client.agency.domain}` : isProduction ? `https://${client.agency.slug}.agency-planner.com` : `http://${client.agency.slug}.localhost:3000`

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { data, error } = await resend.emails.send({
    from,
    to: invitedUser.email,
    reply_to,
    subject: `${invitedByUsername} te ha invitado al equipo de ${client.name}`,
    react: InviteClientEmail({
      username: invitedUser.name,
      agencyName: client.agency.name,
      agencyImage: client.agency.image,
      invitedByUsername,
      invitedByEmail: currentUser.email!,
      teamName: client.name,
      teamImage: client.image,
      inviteLink: `${baseURL}/auth/login?email=${invitedUser.email}`,
    }),
  })

  if (error) {
    console.log("Error sending test email")    
    console.log("error.name:", error.name)    
    console.log("error.message:", error.message)
    return false
  } else {
    console.log("email result: ", data)
  }

}

export async function sendAgencyInvitationEmail(userId: string, agencyId: string) {
  const invitedUser= await getUserDAO(userId)
  if (!invitedUser) 
    throw new Error("No se encontró el usuario invitado")

  const agency= await getAgencyDAO(agencyId)
  if (!agency) 
    throw new Error("No se encontró el agency")

  const currentUser= await getCurrentUser()
  if (!currentUser)
    throw new Error("No se encontró el usuario logueado")

  let from= process.env.DEFAULT_EMAIL_FROM!
  let reply_to= process.env.SUPPORT_EMAIL!
  
  from= agency.emailFrom ? agency.emailFrom : process.env.DEFAULT_EMAIL_FROM!
  reply_to= agency.contactEmail ? agency.contactEmail : process.env.SUPPORT_EMAIL!

  const invitedByName= currentUser.name ? `${currentUser.name}` : `${currentUser.email}`
  const isProduction= process.env.NODE_ENV === "production"
  const baseURL= agency.domain ? `https://${agency.domain}` : isProduction ? `https://${agency.slug}.agency-planner.com` : `http://${agency.slug}.localhost:3000`

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { data, error } = await resend.emails.send({
    from,
    to: invitedUser.email,
    reply_to,
    subject: `${invitedByName} te ha invitado al equipo de ${agency.name} en Agency Planner`,
    react: InviteAgencyEmail({
      userName: invitedUser.name || "Colaborador",
      userEmail: invitedUser.email,
      agencyName: agency.name,
      agencyImage: agency.image,
      invitedByName,
      invitedByEmail: currentUser.email!,
      inviteLink: `${baseURL}/auth/login?email=${invitedUser.email}`,
    }),
  })

  if (error) {
    console.log("Error sending test email")    
    console.log("error.name:", error.name)    
    console.log("error.message:", error.message)
    return false
  } else {
    console.log("email result: ", data)
  }


}

export async function sendContactOnLandingEmail(email: string, message: string) {
 
  let from= process.env.DEFAULT_EMAIL_FROM!
  let reply_to= email

  const html= `
    <div>
      <h3>Mensaje enviado desde la landing page de Agency Planner</h3>
      <p>Email: ${email}</p>
      <p>Mensaje: ${message}</p>
    </div>
  `
  const to = ["rapha.uy@rapha.uy", "gabi@tinta.wine"]

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { data, error } = await resend.emails.send({
    from,
    to,
    reply_to,
    subject: "Mensaje enviado desde la landing page de Agency Planner",
    html,
  });

  if (error) {
    console.log("Error sending test email")    
    console.log("error.name:", error.name)    
    console.log("error.message:", error.message)    
    throw new Error("Error al procesar la solicitud")
  } else {
    console.log("email result: ", data)
  }

}