import { prisma } from "@/lib/db"
import { ClientDAO, getClientDAOBySlug } from "./client-services"

async function main() {
    console.log('main')

    let url = "https://res.cloudinary.com/dtm41dmrz/image/upload/v1700391973/tinta-posts/h9kaoqyv6ols22jiqrce.jpg"
    // Extrae el ID público del recurso de la URL
    let parts = url.split('/');
    let uploadIndex = parts.indexOf('upload');
    let publicId = decodeURIComponent(parts.slice(uploadIndex + 2).join('/').split('.').slice(0, -1).join('.')); // +2 para saltar 'upload' y la versión

    console.log(publicId)
    
}

//main()
