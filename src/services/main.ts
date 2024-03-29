import { getIgProfile } from "./instagram-services"
import { uploadFileWithUrl } from "./upload-file-service"

async function main() {
    console.log('main')
    const nick= "raphauy"
    const igProfile= await getIgProfile(nick)
    console.log(igProfile)

    const url= igProfile?.profile_pic_url
    console.log(url)

    // const res= await uploadFileWithUrl(url!)
    // console.log(res)
}

main()