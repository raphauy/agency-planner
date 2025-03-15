import { IndicatorStats } from "@/components/indicator-card"
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

type RawQueryResult = {
  total: bigint
  percentage_change: unknown
  current_month_count: bigint
}

export async function getContactStats(clientId: string): Promise<IndicatorStats> {
  const result = await prisma.$queryRaw<RawQueryResult[]>`
    WITH monthly_counts AS (
      SELECT 
        COUNT(*) as count,
        DATE_TRUNC('month', "createdAt") as month
      FROM "Contact"
      WHERE 
        "clientId" = ${clientId}
        AND "createdAt" >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      GROUP BY DATE_TRUNC('month', "createdAt")
    )
    SELECT 
      (SELECT COUNT(*) FROM "Contact" WHERE "clientId" = ${clientId}) as total,
      (
        SELECT COALESCE(count, 0) 
        FROM monthly_counts 
        WHERE month = DATE_TRUNC('month', CURRENT_DATE)
      ) as current_month_count,
      COALESCE(
        ROUND(
          CASE 
            WHEN (SELECT count FROM monthly_counts WHERE month = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')) = 0 
            THEN 100
            ELSE (
              ((SELECT COALESCE(count, 0) FROM monthly_counts WHERE month = DATE_TRUNC('month', CURRENT_DATE))::float - 
               (SELECT COALESCE(count, 0) FROM monthly_counts WHERE month = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month'))::float) /
              (SELECT COALESCE(count, 0) FROM monthly_counts WHERE month = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month'))::float * 100
            )
          END::numeric,
          2
        ),
        0
      ) as percentage_change
  `;

  const stats = result[0];
  
  return {
    total: Number(stats.total),
    percentageFromLastMonth: Number(stats.percentage_change),
    currentMonthCount: Number(stats.current_month_count)
  };
}

export async function getRepoDataStats(clientId: string): Promise<IndicatorStats> {
  const result = await prisma.$queryRaw<RawQueryResult[]>`
    WITH monthly_counts AS (
      SELECT 
        COUNT(*) as count,
        DATE_TRUNC('month', "createdAt") as month
      FROM "RepoData"
      WHERE 
        "clientId" = ${clientId}
        AND "createdAt" >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
      GROUP BY DATE_TRUNC('month', "createdAt")
    )
    SELECT 
      (SELECT COUNT(*) FROM "RepoData" WHERE "clientId" = ${clientId}) as total,
      (
        SELECT COALESCE(count, 0) 
        FROM monthly_counts 
        WHERE month = DATE_TRUNC('month', CURRENT_DATE)
      ) as current_month_count,
      COALESCE(
        ROUND(
          CASE 
            WHEN (SELECT count FROM monthly_counts WHERE month = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')) = 0 
            THEN 100
            ELSE (
              ((SELECT COALESCE(count, 0) FROM monthly_counts WHERE month = DATE_TRUNC('month', CURRENT_DATE))::float - 
               (SELECT COALESCE(count, 0) FROM monthly_counts WHERE month = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month'))::float) /
              (SELECT COALESCE(count, 0) FROM monthly_counts WHERE month = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month'))::float * 100
            )
          END::numeric,
          2
        ),
        0
      ) as percentage_change
  `;

  const stats = result[0] || { total: BigInt(0), current_month_count: BigInt(0), percentage_change: 0 };
  
  return {
    total: Number(stats.total),
    percentageFromLastMonth: Number(stats.percentage_change),
    currentMonthCount: Number(stats.current_month_count)
  };
}
  
export async function getConversationsStats(clientId: string): Promise<IndicatorStats> {
  const result = await prisma.$queryRaw<RawQueryResult[]>`
    SELECT 
      COUNT(*) as total,
      (SELECT COUNT(*) FROM "Conversation" WHERE "clientId" = ${clientId}) as current_month_count,
      COALESCE(
        ROUND(
          CASE 
            WHEN (SELECT COUNT(*) FROM "Conversation" WHERE "clientId" = ${clientId}) = 0 
            THEN 100
            ELSE (
              ((SELECT COUNT(*) FROM "Conversation" WHERE "clientId" = ${clientId})::float - 
               (SELECT COUNT(*) FROM "Conversation" WHERE "clientId" = ${clientId} AND "createdAt" >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month'))::float) /
              (SELECT COUNT(*) FROM "Conversation" WHERE "clientId" = ${clientId} AND "createdAt" >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month'))::float * 100
            )
          END::numeric,
          2
        ),
        0
      ) as percentage_change
    FROM "Conversation"
    WHERE "clientId" = ${clientId}
    GROUP BY DATE_TRUNC('month', "createdAt")
  `;

  const stats = result[0];
  
  return {
    total: Number(stats.total),
    percentageFromLastMonth: Number(stats.percentage_change),
    currentMonthCount: Number(stats.current_month_count)
  };
}

export async function getDocumentsStats(clientId: string): Promise<IndicatorStats> {
  const result = await prisma.$queryRaw<RawQueryResult[]>`
    SELECT 
      COUNT(*) as total,
      (SELECT COUNT(*) FROM "Document" WHERE "clientId" = ${clientId}) as current_month_count,
      COALESCE(
        ROUND(
          CASE 
            WHEN (SELECT COUNT(*) FROM "Document" WHERE "clientId" = ${clientId}) = 0 
            THEN 100
            ELSE (
              ((SELECT COUNT(*) FROM "Document" WHERE "clientId" = ${clientId})::float - 
               (SELECT COUNT(*) FROM "Document" WHERE "clientId" = ${clientId} AND "createdAt" >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month'))::float) /
              (SELECT COUNT(*) FROM "Document" WHERE "clientId" = ${clientId} AND "createdAt" >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month'))::float * 100
            )
          END::numeric,
          2
        ),
        0
      ) as percentage_change
    FROM "Document"
    WHERE "clientId" = ${clientId}
    GROUP BY DATE_TRUNC('month', "createdAt")
  `;

  const stats = result[0];
  
  return {
    total: Number(stats.total),
    percentageFromLastMonth: Number(stats.percentage_change),
    currentMonthCount: Number(stats.current_month_count)
  };
}
