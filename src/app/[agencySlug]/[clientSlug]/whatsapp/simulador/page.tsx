
import { getCurrentUser } from '@/lib/utils';
import { getClientDAOBySlugs } from '@/services/client-services';
import { getActiveMessages } from '@/services/conversation-services';
import { redirect } from 'next/navigation';
import SimulatorBox from './simulator-box';

type Props = {
  params: Promise<{
    agencySlug: string
    clientSlug: string
  }>
}
export default async function Chat(props: Props) {
  const params = await props.params;

  const agencySlug= params.agencySlug
  const clientSlug= params.clientSlug

  const client= await getClientDAOBySlugs(agencySlug, clientSlug)

  const user= await getCurrentUser()
  if (!user || !user.email) return redirect("/sign-in")

  const userEmail= user.email as string
  const isAdmin= user.role === "ADMIN"

  const phone= user.email
  const initialMessages= (await getActiveMessages(phone, client.id)) || []

  return (
    <SimulatorBox client={client} userEmail={userEmail} isAdmin={isAdmin} initialMessages={initialMessages} />
  );
}