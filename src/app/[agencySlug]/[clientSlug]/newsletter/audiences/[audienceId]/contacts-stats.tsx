import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserMinus } from "lucide-react"

type Props = {
  contactsCount: number
  unsubscribedCount: number
}

export function ContactsStats({ contactsCount, unsubscribedCount }: Props) {
  const subscribedCount = contactsCount - unsubscribedCount
  const percentage = contactsCount === 0 ? 0 : ((subscribedCount / contactsCount) * 100).toFixed(1)
  const unsubscribedPercentage = contactsCount === 0 ? 0 : (100 - Number(percentage)).toFixed(1)

  return (
    <div className="grid gap-4 md:grid-cols-3 w-full">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Contactos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{contactsCount}</div>
          <p className="text-xs text-muted-foreground">
            Contactos en la audiencia
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Suscritos</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subscribedCount}</div>
          <p className="text-xs text-muted-foreground">
            {percentage}% del total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">No Suscritos</CardTitle>
          <UserMinus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unsubscribedCount}</div>
          <p className="text-xs text-muted-foreground">
            {unsubscribedPercentage}% del total
          </p>
        </CardContent>
      </Card>
    </div>
  )
}