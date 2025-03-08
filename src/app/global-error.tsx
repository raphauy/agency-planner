"use client";

import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // La captura de excepciones de Sentry ha sido eliminada
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        {/* `NextError` es el componente de página de error predeterminado de Next.js. Su definición de tipo
        requiere una prop `statusCode`. Sin embargo, como el App Router
        no expone códigos de estado para errores, simplemente pasamos 0 para renderizar un
        mensaje de error genérico. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}