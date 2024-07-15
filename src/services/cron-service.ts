// take all publications of this month for this client and update the usage record
// for each publication, iterate over the images which are a list of urls comma separated
// and for each url, get the file info and update the usage record
// each publication must have his own usage record

import { prisma } from "@/lib/db"
import { getClientDAO } from "./client-services"
import { getUsageTypeDAOByName } from "./usagetype-services"
import { getFileInfo } from "./upload-file-service"
import { createUsageRecord, getClientUsage, updateUsageRecord, UsageRecordFormValues } from "./usagerecord-services"
import { PublicationType } from "@prisma/client"
import { setUsageRecord } from "./publication-services"
import { format } from "date-fns"
import { AgencyDAO } from "./agency-services"
import { ConfigOptions } from "cloudinary"
import { createMonthlyUsage, MonthlyUsageFormValues, updateMonthlyUsage } from "./monthlyusage-services"

// if the publication have the usage record, update it, if not create it
export async function updatePublicationsUsage(max: number) {

  const clientIds: string[]= []
  
    
  const publications= await prisma.publication.findMany({
    where: {
      usageIsPending: true,
      // createdAt: {
      //   gte: new Date(currentYear, currentMonth, 1),
      //   lt: new Date(currentYear, currentMonth + 1, 1)
      // }
    },
    orderBy: {
      createdAt: 'desc'
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
    if (!publication.client.agency.storageCloudName || !publication.client.agency.storageApiKey || !publication.client.agency.storageApiSecret) {
      console.log(`agency ${publication.client.agency.name} has no storage config`)
    }

    clientIds.push(publication.client.id)
    
    const configOptions= getConfigOptions(publication.client.agency.storageCloudName, publication.client.agency.storageApiKey, publication.client.agency.storageApiSecret)      

    const publicationPath= getPublicationPath(publication.type)

    let imagesCount= 0
    let videosCount= 0
    let storageMB= 0
    try {
      const images= publication.images ? publication.images.split(",") : []
      for (const image of images) {
        const fileInfo= await getFileInfo(image, configOptions)
        if (!fileInfo) {
          console.log("fileInfo not found", publication.client.name, publication.title, image)
          continue          
        }
        imagesCount+= fileInfo.resource_type === "image" ? 1 : 0
        videosCount+= fileInfo.resource_type === "video" ? 1 : 0
        storageMB+= fileInfo.bytes / 1000000
        // @ts-ignore
        console.log(`\t\trate_limit_remaining: ${fileInfo.rate_limit_remaining}`)
        
        // sleep for 1 second
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      const credits= storageMB * creditFactor
      console.log(`\t${format(publication.createdAt, "yyyy-MM-dd")} - mb: ${storageMB.toFixed(2)} -> ${credits.toFixed(2)} credits`)

      const usageCreatedForm: UsageRecordFormValues= {
        createdAt: publication.createdAt,
        description: `${publication.title} (${images.length} archivos)`,
        imagesCount,
        videosCount,
        storageMB,
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
  const currentMonth= new Date().getMonth() + 1
  const currentYear= new Date().getFullYear()

  const uniqueClientIds= Array.from(new Set(clientIds))
  await updateMUsage(uniqueClientIds, currentMonth, currentYear)
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
  
  
  function getConfigOptions(cloud_name: string | null, api_key: string | null, api_secret: string | null): ConfigOptions {
    
    if (cloud_name && api_key && api_secret) {
      return {
        cloud_name,
        api_key,
        api_secret,
      }
    } else {
      return {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    }
  }
}


export async function updateMUsage(clientIds: string[], month: number, year: number) {
  const currentMonth= new Date().getMonth()
  const currentYear= new Date().getFullYear()
  if (currentMonth !== month - 1 || currentYear !== year) {
    console.log("this month is not current")    
    console.log("currentMonth", currentMonth)
    console.log("currentYear", currentYear)
    console.log("month", month)
    console.log("year", year)
    return
  }
  
  // iterate over all clients and update the monthly usage, if it not exist, create it
  for (const clientId of clientIds) {
    const client= await getClientDAO(clientId)
    if (!client) throw new Error("Client not found")
    const agency= client.agency
    
    const usageType= await getUsageTypeDAOByName("Storage")
    if (!usageType) throw new Error("UsageType not found")
    const creditFactor= usageType.creditFactor

    const monthLabel= format(new Date(year, month-1, 1), "MMMM")

    let monthlyUsage= await prisma.monthlyUsage.findFirst({
      where: {
        month,
        year,
        clientId
      }
    })
    if (!monthlyUsage) {
      const monthlyUsageForm: MonthlyUsageFormValues= {
        month,
        year,
        storageCredits: 0,
        publicationsCount: 0,
        imagesCount: 0,
        videosCount: 0,
        storageMB: 0,
        llmCredits: 0,
        conversationsCount: 0,
        monthLabel,
        agencyName: agency.name,
        clientName: client.name,
        clientId,
        agencyId: agency.id,
      }
      monthlyUsage= await createMonthlyUsage(monthlyUsageForm)
      console.log(`created monthly usage for ${client.name} in ${monthLabel}`)
    }

    const clientUsage= await getClientUsage(clientId, year, month-1)
    if (!clientUsage) {
      console.log(`no client usage for ${client.name} in ${monthLabel}`)
      continue
    }

    // update the monthly usage
    const monthlyUsageFormValues: MonthlyUsageFormValues= {
      month,
      year,
      storageCredits: clientUsage.storageCredits,
      publicationsCount: clientUsage.imagesCount + clientUsage.videosCount,
      imagesCount: clientUsage.imagesCount,
      videosCount: clientUsage.videosCount,
      storageMB: clientUsage.storageMB,
      llmCredits: clientUsage.llmCredits,
      conversationsCount: 0,
      monthLabel,
      agencyName: agency.name,
      clientName: client.name,
      clientId,
      agencyId: agency.id,
    }
    // update the monthly usage
    await updateMonthlyUsage(monthlyUsage.id, monthlyUsageFormValues)
    console.log(`updated monthly usage for ${client.name} in ${monthLabel}`)
  }
}