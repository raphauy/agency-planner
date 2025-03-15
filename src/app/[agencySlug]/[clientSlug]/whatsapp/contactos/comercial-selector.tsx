"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { ComercialDAO } from "@/services/comercial-services"

type Props = {
  baseUrl: string
  comercials: ComercialDAO[]
}

export default function ComercialSelector({ baseUrl, comercials }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }

      return params.toString()
    },
    [searchParams]
  )

  const handleChange = (comercialId: string) => {
    router.push(baseUrl + "?" + createQueryString("comercialId", comercialId === "all" ? "" : comercialId))
  }

  return (
    <Select
      value={searchParams.get("comercialId") || "all"}
      onValueChange={handleChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Todos los comerciales" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos los comerciales</SelectItem>
        {comercials.map((comercial) => (
          <SelectItem key={comercial.id} value={comercial.id}>
            {comercial.user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}