import { type NextRequest } from "next/server"

export const maxDuration = 299

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get('url')
    const title = searchParams.get('title')

    try {

        if (!url) throw new Error('Url required')
        if (!title) throw new Error('Title required')

        console.log('Title:', title)
        console.log('Downloading:', url)

        const image = await fetch(url)
        const contentType = image.headers.get('content-type')
        let type = contentType?.split('/')[1]
        
        // Limpiar la extensión eliminando cualquier parámetro adicional después del punto y coma
        if (type) {
            type = type.split(';')[0]
        }
        
        if (type?.includes("quicktime")) {
            type = "mov"
        }

        console.log('file name:', `${title}.${type}`)

        // the url is a image
        return new Response(image.body, {
            status: 200,
            headers: {
                'Content-Disposition': `attachment; filename="${title}.${type}"`,
                'Content-Type': `${contentType}`,
            }
        })
   } catch (e) {
        if (e instanceof Error) {
            console.error(e)
            return new Response(e.message, {
                status: 400,
            })
        }
    }
}