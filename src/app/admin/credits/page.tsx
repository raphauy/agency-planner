import { CreditsComponent } from "./credits"

type Props = {
  params: Promise<{ [key: string]: string | string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CreditsPage({ searchParams }: Props) {
  const params = await searchParams;
  const month = params.month as string || "";

  return (
    <div className="w-full">      

      <div className="text-2xl font-bold mx-auto my-2">
        Credits
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <CreditsComponent />
      </div>
    </div>
  )
}
  
    