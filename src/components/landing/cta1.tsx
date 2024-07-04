import Link from "next/link"

export function CTA1() {
  return (
    <section className="w-full py-6 md:py-12 lg:py-16">
      <div className="space-y-2 container max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
          Agency Planner es un software diseñado para agencias que buscan optimizar la gestión de los planes de
          contenido de sus clientes.
        </h2>
        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Con Agency Planner, las agencias pueden crear y enviar planes mensuales de contenido, permitiendo a los
          clientes revisar, comentar y aprobar directamente en la plataforma.
        </p>
      </div>
    </section>
  )
}
