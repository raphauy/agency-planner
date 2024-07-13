import { Separator } from "@/components/ui/separator"

type Props = {
    storageCredits: number
    llmCredits: number
}
export default function CreditsBox({ storageCredits, llmCredits }: Props) {
  const total= storageCredits + llmCredits
  return (
    <div className="text-right flex items-center justify-end">
        <p className="w-28">{storageCredits.toFixed(2)}</p>
        <Separator orientation="vertical" className="h-4 mx-2" />
        <p className="w-28">{llmCredits.toFixed(2)}</p>
        <Separator orientation="vertical" className="h-4 mx-2" />
        <p className="w-28">{total.toFixed(2)}</p>
    </div>
  )
}
