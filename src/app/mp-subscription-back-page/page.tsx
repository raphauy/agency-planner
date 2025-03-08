
type Props = {
  params: Promise<{
    storeSlug: string
  }>
  searchParams: Promise<{
    collection_status: string
    external_reference: string
  }>
}
export default async function PagoConfirmadoPage(props: Props) {
  const searchParams = await props.searchParams;

  // log searchParams
  console.log(searchParams)

  return (
    <div className='w-full'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl'>
          Test finalized
        </h1>
    </div>
  )
}


