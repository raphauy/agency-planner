import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding...")
  
  const adminUser= await seedAdmin()
  console.log({ adminUser })
  
}

async function seedAdmin() {
  const adminUser = await prisma.user.create({
    data: {
      name: "Rapha",
      email: "rapha.uy@rapha.uy",
      role: "ADMIN"
    },
  })
  return adminUser
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
