import { prisma } from "@/lib/db"

export type MonthlyStats = {
  month: string
  totalPosts: number
  totalReels: number
  totalStories: number
}
export type InstagramStats = {
  totalPosts: number
  totalReels: number
  totalStories: number
}

export async function getInstagramStats(clientId: string): Promise<InstagramStats | null> {
    const found = await prisma.client.findUnique({
        where: {
          id: clientId
        },
        include: {
          publications: {
            where: {
              type: {
                in: ["INSTAGRAM_POST", "INSTAGRAM_REEL", "INSTAGRAM_STORY"]
              },
              status: {
                not: {
                    in: ["BORRADOR"]
                }
              }
            },
            select: {
              id: true,
              type: true,
              status: true,
              publicationDate: true,
            },
            orderBy: {
              publicationDate: "desc"
            }
          }
        }
      })
      if (!found) return null
      const publications = found.publications
      const totalPosts = publications.filter((publication) => publication.type === "INSTAGRAM_POST").length
      const totalReels = publications.filter((publication) => publication.type === "INSTAGRAM_REEL").length
      const totalStories = publications.filter((publication) => publication.type === "INSTAGRAM_STORY").length
      
      const res= {
        totalPosts,
        totalReels,
        totalStories,
      }

      return res
}


export async function getMonthlyStats(clientId: string, lasMonths: number = 6): Promise<MonthlyStats[]> {
    const found = await prisma.client.findUnique({
        where: {
          id: clientId
        },
        include: {
          publications: {
            where: {
              type: {
                in: ["INSTAGRAM_POST", "INSTAGRAM_REEL", "INSTAGRAM_STORY"]
              },
              status: {
                not: {
                    in: ["BORRADOR"]
                }
              }
            },
            select: {
              id: true,
              type: true,
              status: true,
              publicationDate: true,
            },
            orderBy: {
              publicationDate: "desc"
            }
          }
        }
      });
      if (!found) return [];
      const publications = found.publications;
    
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const monthlyStats = [];

    for (let i = 0; i < lasMonths; i++) {
        const monthIndex = (currentMonthIndex - i + 12) % 12;
        const offset = Math.ceil((i - currentMonthIndex) / 12);
        const monthYear = currentYear - offset;
        const month = months[monthIndex];
        const publicationsByMonth = publications.filter((publication) => 
            publication.publicationDate !== null && 
            new Date(publication.publicationDate).getMonth() === monthIndex &&
            new Date(publication.publicationDate).getFullYear() === monthYear
        );
        const totalPosts = publicationsByMonth.filter((publication) => publication.type === "INSTAGRAM_POST").length;
        const totalReels = publicationsByMonth.filter((publication) => publication.type === "INSTAGRAM_REEL").length;
        const totalStories = publicationsByMonth.filter((publication) => publication.type === "INSTAGRAM_STORY").length;
        monthlyStats.push({
            month,
            totalPosts,
            totalReels,
            totalStories
        });
    }
    return monthlyStats.reverse();
}
