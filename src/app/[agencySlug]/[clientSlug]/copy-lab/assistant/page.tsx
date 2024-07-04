import SimulatorBox from "./simulator-box";

type Props = {
    params: {
        clientSlug: string
    },
}
export default async function SimulatorPage({ params }: Props) {
    const clientSlug= params.clientSlug as string
      
    return (
        <div className="flex flex-col items-center w-full h-full">
          <SimulatorBox clientSlug={clientSlug} conversationId="new" />
        </div>
    )
}
