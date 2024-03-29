import { Card, CardContent } from "@/components/ui/card"
import { es } from "date-fns/locale"
import { getAgencysDAO } from "@/services/agency-services"
import { InstagramLogoIcon } from '@radix-ui/react-icons'
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import Link from "next/link"

export default async function AdminPage() {

  const data= await getAgencysDAO()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full mt-4">
      {
        data.map(agency => (
          <Card key={agency.id} className="flex flex-col min-w-80 p-6 w-full shadow-md text-muted-foreground h-52">

            <div className="flex items-center mb-4 text-gray-900 font-bold justify-between">
              <Link href={`/${agency.slug}`} prefetch={false} className="h-full flex items-center gap-2">
                {agency.image && <Image src={agency.image} alt={agency.name} width={40} height={40} className="rounded-full" />}
                <p className="dark:text-white flex-1">{agency.name}</p>
              </Link>
              <Link href={`https://instagram.com/${agency.igHandle}`} prefetch={false} target="_blank">
                <InstagramLogoIcon className="w-6 h-6" />
              </Link>
                
            </div>
            <Link href={`/${agency.slug}`} prefetch={false} className="h-full flex flex-col justify-between">
              <CardContent className="p-0 line-clamp-3">
              {agency.description}
              </CardContent>
              <p className="flex justify-end text-sm mt-2">{formatDistanceToNow(agency.createdAt, { locale: es })}</p>
            </Link>
          </Card>
        ))
      }
    </div>
  )
}
