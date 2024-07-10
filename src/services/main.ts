import { getFileInfo } from "./upload-file-service";

async function main() {
    console.log('main')
    const urlDelRecurso1 = "https://res.cloudinary.com/dcy8vuzjb/image/upload/v1720212326/agency/dev/Tinta_GlobalAPP_03_cnoe5d.png";
    const result1 = await getFileInfo(urlDelRecurso1)
    console.log(result1)
    const megaByrtes= result1?.bytes ? result1?.bytes / 1000000 : 0
    console.log(megaByrtes)
    const credits= megaByrtes * 0.1
    console.log(credits)

    const urlDelRecurso2 = "https://res.cloudinary.com/dcy8vuzjb/video/upload/v1720212383/agency/dev/copy_F9123764-6EFF-4BDF-A454-8F827058C782_njgzwj.mp4";
    const result2 = await getFileInfo(urlDelRecurso2)
    console.log(result2)
    const megaByrtes2= result2?.bytes ? result2?.bytes / 1000000 : 0
    console.log(megaByrtes2)
    const credits2= megaByrtes2 * 0.1
    console.log(credits2)

}

//main()

