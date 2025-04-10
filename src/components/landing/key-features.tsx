import { CheckCircle2, Users, Calendar, MessageSquare, Zap, Shield } from "lucide-react"

export function KeyFeatures() {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Gestión de clientes",
      description: "Administra todos tus clientes en un solo lugar con permisos personalizados y acceso organizado."
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: "Planificación de contenido",
      description: "Crea, programa y gestiona el contenido para múltiples redes sociales desde una interfaz unificada."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Colaboración en tiempo real",
      description: "Trabaja con tu equipo y clientes en un entorno colaborativo con comentarios y revisiones."
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Generación con IA",
      description: "Aprovecha la inteligencia artificial para crear y optimizar contenido para redes sociales."
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
      title: "Flujos de aprobación",
      description: "Implementa procesos de revisión y aprobación personalizados para cada cliente y proyecto."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Roles y permisos",
      description: "Configura diferentes niveles de acceso para miembros del equipo y clientes."
    }
  ]

  return (
    <section className="w-full py-12 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Características principales</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Todo lo que necesitas para llevar tu agencia al siguiente nivel
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="p-2">{feature.icon}</div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 