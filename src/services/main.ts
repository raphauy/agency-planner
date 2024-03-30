import { getIgProfile } from "./instagram-services"
import { getFileInfo, uploadFileWithUrl } from "./upload-file-service"

async function main() {
    console.log('main')
    // const nick= "raphauy"
    // const igProfile= await getIgProfile(nick)
    // console.log(igProfile)

    // const url= igProfile?.profile_pic_url
    // console.log(url)

    // const res= await uploadFileWithUrl(url!)
    // console.log(res)

    // La URL del recurso que quieres obtener información
    const urlDelRecurso = "https://res.cloudinary.com/dcy8vuzjb/image/upload/v1711802519/agency/pepe/vina_octubre_1_nxt2kl.jpg";
    const result = await getFileInfo(urlDelRecurso)
    console.log(result)

}

//main()