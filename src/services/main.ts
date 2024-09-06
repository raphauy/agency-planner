import { duplicateClient } from "./client-duplication-service"

async function main() {
    console.log('main')

    const clientId= "cm0b7kd33000113xrkbsegqnu"
//    const agencyId= "cm0f5a3sv0000p539g0pz7wxf" // zegnio
    const agencyId= "clwjieiz40000salv81gc7ky1" // Test Agency
    

    const duplicatedClient= await duplicateClient(clientId, agencyId)
    console.log(duplicatedClient)
}

//main()
