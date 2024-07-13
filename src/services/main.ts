import { prisma } from "@/lib/db"
import { ClientDAO, getClientDAOBySlug } from "./client-services"

async function main() {
    console.log('main')

    let url = "https://res.cloudinary.com/dtm41dmrz/image/upload/v1710265487/tinta-posts/gpgumixx4mtvf8htqaio.png"
    // Extrae el ID público del recurso de la URL
    let parts = url.split('/');
    let uploadIndex = parts.indexOf('upload');
    let publicId = decodeURIComponent(parts.slice(uploadIndex + 2).join('/').split('.').slice(0, -1).join('.')); // +2 para saltar 'upload' y la versión

    console.log(publicId)
    
    url = "https://res.cloudinary.com/dcy8vuzjb/video/upload/v1719928907/agency/dev/SaveInsta.App_-_3398519577291121127_inoj8f.mp4"

    parts = url.split('/');
    uploadIndex = parts.indexOf('upload');
    publicId = decodeURIComponent(parts.slice(uploadIndex + 2).join('/').split('.').slice(0, -1).join('.')); // +2 para saltar 'upload' y la versión
    console.log(publicId)
}

main();
