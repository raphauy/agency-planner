
import { getClientDAOBySlugs } from '@/services/client-services';
import SimulatorBox from './simulator-box';
import { getCurrentUser } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { getActiveMessages } from '@/services/conversation-services';
import { Message } from 'ai';

type Props = {
  params: {
    agencySlug: string
    clientSlug: string
  }
}
export default async function Chat({ params }: Props) {

  const agencySlug= params.agencySlug
  const clientSlug= params.clientSlug

  const client= await getClientDAOBySlugs(agencySlug, clientSlug)

  const user= await getCurrentUser()
  if (!user || !user.email) return redirect("/sign-in")
    
  const userEmail= user.email as string
  const isAdmin= user.role === "ADMIN"

  const phone= user.email
  const initialMessages= await getActiveMessages(phone, client.id) || []

  return (
    <SimulatorBox client={client} userEmail={userEmail} isAdmin={isAdmin} initialMessages={initialMessages} />
  );
}