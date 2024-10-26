import { connectionState, createInstanceBasic, deleteInstance, enableChatwoot, fetchInstances } from "./wrc-sdk"
import { ChatwootParams } from "./wrc-sdk-types"
import { config } from "dotenv"
config()

async function main() {
    console.log('main')
//    const duplicatedClient= await duplicateClient(clientId, agencyId)

//    const instanceName= "cantina-barreiro"
    const instanceName= "test"
    // const instance= await createInstanceBasic(instanceName)
    // console.log(instance)
    // const res= await deleteInstance(instanceName)
    // console.log("fetching instances:")
    // const data= await fetchInstances()
    // console.log(data)

    // check status of instance
    // const status= await connectionState(instanceName)
    // console.log(status)

    const params: ChatwootParams = {
        enabled: true,
        accountId: String(2),
        token: process.env.CHATWOOT_ACCESS_TOKEN!,
        url: process.env.CHATWOOT_URL!,
        signMsg: true,
        reopenConversation: false,
        conversationPending: true,
        nameInbox: instanceName,
        importContacts: false,        
        importMessages: false,
        daysLimitImportMessages: 7,
        signDelimiter: '\n',
        autoCreate: true,
        organization: 'WRC',
        logo: '',
    }

    const res= await enableChatwoot(instanceName, params)
    console.log(res)

}

main()
