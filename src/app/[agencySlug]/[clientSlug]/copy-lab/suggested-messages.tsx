"use client"

import { Card } from "@/components/ui/card"
import { DoorOpenIcon, GraduationCapIcon, ImageIcon, LightbulbIcon, Megaphone, PlaneIcon, PlayCircle, SmileIcon } from "lucide-react"

type Props= {
    setText: (text: string) => void
}

const messages= [
    {
        copy: "Necesito un copy atractivo para una publicación en Instagram sobre nuestro nuevo producto de belleza. Queremos resaltar sus beneficios naturales y orgánicos.",
        icon: SmileIcon,
    },
    {
        copy: "Hola, quiero crear un copy para un reel de Instagram promocionando nuestra última colección de ropa deportiva. Necesitamos un mensaje enérgico y motivador que anime a nuestros seguidores a moverse. ¿Me ayudas?",
        icon: PlayCircle,
    },
    {
        copy: "Quiero crear un anuncio en Instagram para promocionar nuestro servicio de diseño gráfico. El objetivo es captar la atención de pequeñas empresas que necesitan una renovación de su imagen. ¿Qué me sugieres?",
        icon: Megaphone,
    },
]
export default function SuggestedMessages({ setText }: Props) {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {messages.map((message, index) => (
                    <Card key={index} className="flex flex-col items-center p-4 space-y-2 text-center cursor-pointer"
                        onClick={() => setText(message.copy)}
                    >
                        <message.icon className="w-6 h-6 text-yellow-500" />
                        <p className="text-sm font-medium text-muted-foreground">{message.copy}</p>
                    </Card>
                ))}
                {/* <Card className="flex flex-col items-center p-4 space-y-2 text-center cursor-pointer"
                    onClick={() => setText("Necesito un copy atractivo para una publicación en Instagram sobre nuestro nuevo producto de belleza. Queremos resaltar sus beneficios naturales y orgánicos.")}
                >
                    <LightbulbIcon className="w-6 h-6 text-yellow-500" />
                    <p className="text-sm font-medium text-muted-foreground">Reciclaje de dibujos de los niños</p>
                </Card> */}
            </div>
        </div>
    )
}

