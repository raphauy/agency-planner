
type Props = {
  params: {
    storeSlug: string
  }
  searchParams: {
    collection_status: string
    external_reference: string
  }
}
export default async function PagoConfirmadoPage({ params, searchParams }: Props) {

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


