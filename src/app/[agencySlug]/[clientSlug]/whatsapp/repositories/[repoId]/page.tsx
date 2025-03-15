import FCConfig from "./fc-config"

type Props = {
  params: Promise<{
    repoId: string
  }>
}

export default async function RepositoryPage({ params }: Props) {
  const { repoId } = await params

  return (
    <FCConfig repoId={repoId} />
  )
}
