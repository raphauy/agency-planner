import { ContactForm } from "./contact-form"

export default function ContactSection() {
  return (
    <div className="mx-auto max-w-lg space-y-6 min-w-[500px] mb-20">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">¿Tienes una agencia?</h2>
        <p className="text-muted-foreground">Escríbenos y te contactamos con más detalles.</p>
      </div>
      <ContactForm />
    </div>
  )
}