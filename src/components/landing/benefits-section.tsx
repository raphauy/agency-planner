import Image from "next/image"

export function BenefitsSection() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Beneficios para tu agencia
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Descubre cómo Agency Planner resuelve los problemas cotidianos de las agencias
            </p>
          </div>
        </div>

        <div className="grid gap-6 mt-12 lg:grid-cols-2 items-center">
          <div className="space-y-8">
            <div className="flex flex-col space-y-2">
              <h3 className="text-2xl font-bold">Adiós a las herramientas fragmentadas</h3>
              <p className="text-muted-foreground">
                Unifica todas tus necesidades de gestión de contenido en una sola plataforma. No más saltos entre Trello, Google Docs, Excel y otras herramientas.
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <h3 className="text-2xl font-bold">Colaboración simplificada</h3>
              <p className="text-muted-foreground">
                Facilita la colaboración entre tu equipo y tus clientes con roles claros y flujos de trabajo optimizados.
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <h3 className="text-2xl font-bold">Automatización inteligente</h3>
              <p className="text-muted-foreground">
                Reduce el trabajo manual con herramientas de IA para la generación de contenido y automatización de la programación de publicaciones.
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <h3 className="text-2xl font-bold">Mayor visibilidad</h3>
              <p className="text-muted-foreground">
                Dashboards y reportes que te permiten visualizar el estado de todas tus actividades y el rendimiento de tus publicaciones.
              </p>
            </div>
          </div>

          <div className="mx-auto relative aspect-video overflow-hidden rounded-xl border shadow-lg">
            <Image
              src="/image-placeholder.png"
              alt="Dashboard de Agency Planner"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  )
} 