import * as z from "zod"
import { prisma } from "@/lib/db"
import { ClientDAO } from "./client-services"

export type FunctionalityDAO = {
	id: string
	name: string
	slug: string
  image: string | undefined
	createdAt: Date
	updatedAt: Date
}

export const functionalitySchema = z.object({
	name: z.string({required_error: "name is required."}),
	slug: z.string({required_error: "slug is required."}),
  image: z.string().optional(),
})

export type FunctionalityFormValues = z.infer<typeof functionalitySchema>


export async function getFunctionalitysDAO() {
  const found = await prisma.functionality.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as FunctionalityDAO[]
}

export async function getFunctionalityDAO(id: string) {
  const found = await prisma.functionality.findUnique({
    where: {
      id
    },
  })
  return found as FunctionalityDAO
}
    
export async function createFunctionality(data: FunctionalityFormValues) {

  const created = await prisma.functionality.create({
    data
  })
  return created
}

export async function updateFunctionality(id: string, data: FunctionalityFormValues) {
  const updated = await prisma.functionality.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteFunctionality(id: string) {
  const deleted = await prisma.functionality.delete({
    where: {
      id
    },
  })
  return deleted
}


// export async function changeClientFunctionalityPermission(functionalityId: string, clientId: string) {
//   // if functionality have client, remove it
//   // if functionality don't have client, add it

//   const found= await prisma.functionality.findUnique({
//     where: {
//       id: functionalityId
//     },
//     include: {
//       clients: true
//     }
//   })

//   if (!found) {
//     throw new Error("Functionality not found")
//   }

//   const hasClient= found.clients.some((client) => client.id === clientId)

//   if (hasClient) {
//     await prisma.functionality.update({
//       where: {
//         id: functionalityId
//       },
//       data: {
//         clients: {
//           disconnect: {
//             id: clientId
//           }
//         }
//       }
//     })
//   } else {
//     await prisma.functionality.update({
//       where: {
//         id: functionalityId
//       },
//       data: {
//         clients: {
//           connect: {
//             id: clientId
//           }
//         }
//       }
//     })
//   }

//   return true
// }

export async function getFunctionalitiesOfAgency(agencyId: string) {
  const found= await prisma.functionality.findMany({
    where: {
      clients: {
        some: {
          agencyId
        }
      }
    },
    include: {
      clients: true
    }    
  })

  return found as FunctionalityDAO[]
}

export async function getFunctionalitiesByClientSlug(clientSlug: string) {
  const found= await prisma.functionality.findMany({
    where: {
      clients: {
        some: {
          slug: clientSlug
        }
      }
    },
    include: {
      clients: true
    }    
  })

  return found as FunctionalityDAO[]
}