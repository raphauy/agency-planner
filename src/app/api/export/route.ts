import { exportRepoData } from "@/services/file-export-services";
import { format } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    
    const agencySlug = searchParams.get("agencySlug")
    const clientSlug = searchParams.get("clientSlug")
    const repoName = searchParams.get("repoName")
    const startStr = searchParams.get("start")
    const endStr = searchParams.get("end")

    if (!agencySlug || !clientSlug) {
        return NextResponse.json({ "error": "Agency slug and client slug are required" }, { status: 400 })
    }
    if (!repoName) {
        return NextResponse.json({ "error": "Repo name is required" }, { status: 400 })
    }

    console.log("agencySlug:", agencySlug)
    console.log("clientSlug:", clientSlug)
    console.log("repoName:", repoName)
    console.log("start:", startStr)
    console.log("end:", endStr)

    try {
        const excelBuffer = await exportRepoData(agencySlug, clientSlug, repoName, startStr || undefined, endStr || undefined)
        
        // Crear el nombre del archivo
        const fileName = `${repoName}_${format(new Date(), 'yyyy-MM-dd-HH-mm')}.xlsx`

        // Retornar el archivo para descarga
        return new NextResponse(excelBuffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${fileName}"`,
            },
        })
    } catch (error) {
        console.error("Error exporting data:", error)
        return NextResponse.json({ "error": "Error exporting data" }, { status: 500 })
    }
}

