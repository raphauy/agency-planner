import { ArrowRight } from "lucide-react"

export function WorkflowSection() {
  const steps = [
    {
      number: "01",
      title: "Configura tu agencia",
      description: "Crea tu perfil de agencia, personaliza la apariencia y configura tus preferencias."
    },
    {
      number: "02",
      title: "Añade clientes",
      description: "Invita a tus clientes a la plataforma y configura sus perfiles con accesos personalizados."
    },
    {
      number: "03",
      title: "Crea contenido",
      description: "Utiliza nuestra herramienta de planificación para crear y organizar el contenido para redes sociales."
    },
    {
      number: "04",
      title: "Revisa y aprueba",
      description: "Facilita el proceso de revisión y aprobación con flujos de trabajo colaborativos."
    },
    {
      number: "05",
      title: "Programa publicaciones",
      description: "Establece fechas y horarios para publicar automáticamente el contenido aprobado."
    },
    {
      number: "06",
      title: "Analiza resultados",
      description: "Monitorea el rendimiento de tus publicaciones con análisis detallados y reportes."
    }
  ]

  return (
    <section className="w-full py-12 md:py-24 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 mb-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Flujo de trabajo simplificado
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Optimiza tu proceso de planificación y publicación de contenido
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 mt-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col">
                <div className="absolute -top-4 -left-4 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-xl font-bold">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-2 -right-4 md:top-2 md:right-[-2rem] lg:top-2 lg:right-[-2rem] hidden md:block">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="p-6 pt-8 rounded-lg border shadow-sm">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 