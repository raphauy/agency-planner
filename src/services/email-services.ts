import CodeVerifyEmail from "@/components/email/verify-email";
import { Resend } from "resend";
import { getAgencyDAO } from "./agency-services";
import { getUserDAO } from "./user-services";
import { getClientDAO, getFullClientDAO } from "./client-services";
import { getCurrentUser } from "@/lib/utils";
import { InviteUserEmail } from "@/components/email/client-invite-user";




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
  if (!currentUser) throw new Error("No se encontró el usuario logueado")

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
  const resend = new Resend(process.env.RESEND_API_KEY);

  const inviteName= currentUser.name ? `${currentUser.name}` : `${currentUser.email}`
 
  const isProduction= process.env.NODE_ENV === "production"
  const baseURL= client.agency.domain ? `https://${client.agency.domain}` : isProduction ? `https://${client.agency.slug}.agency-planner.com` : `http://${client.agency.slug}.localhost:3000`
  const { data, error } = await resend.emails.send({
    from,
    to: invitedUser.email,
    reply_to,
    subject: `${inviteName} te ha invitado al equipo de ${client.name}`,
    react: InviteUserEmail({
      username: invitedUser.name,
      agencyName: client.agency.name,
      agencyImage: client.agency.image,
      invitedByUsername: inviteName,
      invitedByEmail: currentUser.email!,
      teamName: client.name,
      teamImage: client.image,
      inviteLink: `${baseURL}/auth/login?email=${invitedUser.email}`,
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

export async function sendAgencyInvitationEmail(userId: string, agencyId: string) {
  const invitedUser= await getUserDAO(userId)
  const agency= await getAgencyDAO(agencyId)
  const currentUser= await getCurrentUser()
}