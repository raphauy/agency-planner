// take all publications of this month for this client and update the usage record
// for each publication, iterate over the images which are a list of urls comma separated
// and for each url, get the file info and update the usage record
// each publication must have his own usage record

import { prisma } from "@/lib/db"
import { getClientDAO } from "./client-services"
import { getUsageTypeDAOByName } from "./usagetype-services"
import { getFileInfo } from "./upload-file-service"
import { createUsageRecord, updateUsageRecord, UsageRecordFormValues } from "./usagerecord-services"
import { PublicationType } from "@prisma/client"
import { setUsageRecord } from "./publication-services"

// if the publication have the usage record, update it, if not create it
export async function updatePublicationsUsage(max: number) {
  
    const currentMonth= new Date().getMonth()
    const currentYear= new Date().getFullYear()
    
    const publications= await prisma.publication.findMany({
      where: {
        usageIsPending: true,
        createdAt: {
          gte: new Date(currentYear, currentMonth, 1),
          lt: new Date(currentYear, currentMonth + 1, 1)
        }
      },
      orderBy: {
        createdAt: 'asc'
      },
      include: {
        usageRecord: true,
        client: {
          include: {
            agency: true
          }
        }
      },
      take: max
    })
    if (publications.length === 0) {
      console.log("No publications found")
    } else {
      console.log(`updating ${publications.length} publications`)  
    }
    
  
    const usageType= await getUsageTypeDAOByName("Storage")
    if (!usageType) throw new Error("UsageType not found")
    const creditFactor= usageType.creditFactor
  
    for (const publication of publications) {
      const publicationPath= getPublicationPath(publication.type)
  
      try {
        const images= publication.images ? publication.images.split(",") : []
        let credits= 0
        for (const image of images) {
          const fileInfo= await getFileInfo(image)
          if (!fileInfo) {
            console.log("fileInfo not found", publication.client.name, publication.title, image)
            continue          
          }
          const megaBytes= fileInfo.bytes / 1000000
          const newCredits= megaBytes * creditFactor
          console.log(`mb: ${megaBytes} -> ${newCredits} credits`)
          
          credits+= newCredits
          
          // sleep for 1 second
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
  
        const usageCreatedForm: UsageRecordFormValues= {
          description: `${publication.title} (${images.length} archivos)`,
          credits,
          url: `/${publication.client.agency.slug}/${publication.client.slug}/${publicationPath}?post=${publication.id}`,
          usageTypeId: usageType.id,
          agencyId: publication.client.agencyId,
          clientId: publication.client.id,
        }
        if (publication.usageRecord) {
          await updateUsageRecord(publication.usageRecord.id, usageCreatedForm)
          console.log(`${publication.client.name} - ${publication.title} - ${credits.toFixed(2)} credits - updated`)
        } else {
          const usageCreated= await createUsageRecord(usageCreatedForm)
          console.log(`${publication.client.name} - ${publication.title} - ${credits.toFixed(2)} credits - created`)
          await setUsageRecord(publication.id, usageCreated.id)
        }

        await prisma.publication.update({
          where: {
            id: publication.id
          },
          data: {
            usageIsPending: false
          }
        })
  
      } catch (error) {
        console.error(error)
        continue
      }
  
    }
  }
  
  
  function getPublicationPath(type: PublicationType) {
    switch (type) {
      case PublicationType.INSTAGRAM_POST:
        return "instagram/posts"
      case PublicationType.INSTAGRAM_REEL:
        return "instagram/reels"
      case PublicationType.INSTAGRAM_STORY:
        return "instagram/historias"
      default:
        return "instagram/feed"
    }
  }
  
  