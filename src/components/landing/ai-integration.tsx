import Image from "next/image"
import { Sparkles } from "lucide-react"

export function AIIntegration() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 w-fit">
              <Sparkles className="mr-1 h-3 w-3" />
              <span>Potenciado con IA</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Genera contenido creativo con Inteligencia Artificial
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Aprovecha el poder de la IA para crear copys impactantes, ideas de publicaciones y optimizar tu contenido en cuestión de segundos.
              </p>
            </div>
            <ul className="grid gap-2 py-4">
              <li className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                </div>
                <span>Genera ideas de contenido adaptadas a cada red social</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                </div>
                <span>Optimiza textos existentes para mejorar el engagement</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                </div>
                <span>Sugiere hashtags relevantes y tendencias actuales</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                </div>
                <span>Adapta el tono de voz según la marca y el público objetivo</span>
              </li>
            </ul>
          </div>
          <div className="mx-auto relative aspect-video overflow-hidden rounded-xl border shadow-lg">
            <Image
              src="/image-placeholder.png"
              alt="Interfaz de IA de Agency Planner"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-transparent opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  )
} 