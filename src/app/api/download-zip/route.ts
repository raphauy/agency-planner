import { type NextRequest } from "next/server"
import AdmZip from "adm-zip"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const urlsParam = searchParams.get('urls')
    const title = searchParams.get('title')

    try {
        if (!urlsParam) throw new Error('URLs requeridas')
        if (!title) throw new Error('Título requerido')

        console.log('Título:', title)
        console.log('Creando ZIP con URLs:', urlsParam)

        // Parsear el parámetro de URLs que viene como string separado por comas
        const urls = urlsParam.split(',')
        
        if (urls.length <= 1) {
            throw new Error('Se requieren múltiples archivos para crear un ZIP')
        }

        // Crear un nuevo archivo ZIP
        const zip = new AdmZip()
        
        // Obtener cada archivo y añadirlo al ZIP
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i]
            const response = await fetch(url)
            const contentType = response.headers.get('content-type')
            
            // Determinar la extensión apropiada para el archivo
            let extension = contentType?.split('/')[1] || 'file'
            if (extension.includes("quicktime")) {
                extension = "mov"
            }
            
            // Crear un nombre de archivo único dentro del ZIP
            const fileName = `${title}_${i+1}.${extension}`
            
            // Añadir el archivo al ZIP
            const buffer = await response.arrayBuffer()
            zip.addFile(fileName, Buffer.from(buffer))
        }
        
        // Obtener el contenido del ZIP como Buffer
        const zipBuffer = zip.toBuffer()
        
        // Devolver el archivo ZIP como respuesta
        return new Response(zipBuffer, {
            status: 200,
            headers: {
                'Content-Disposition': `attachment; filename="${title}.zip"`,
                'Content-Type': 'application/zip',
            }
        })
    } catch (e) {
        if (e instanceof Error) {
            console.error(e)
            return new Response(e.message, {
                status: 400,
            })
        }
        return new Response('Error desconocido', {
            status: 500,
        })
    }
} 