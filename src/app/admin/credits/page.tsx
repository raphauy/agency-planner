import { CreditsComponent } from "./credits"

type Props= {
  searchParams: {    
    month: string
  }
}
export default async function CreditsPage({ searchParams }: Props) {


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
      
    