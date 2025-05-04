import * as XLSX from 'xlsx';
import { getFullRepoDatasDAO } from "./repodata-services";
import { getClientDAOBySlugs } from './client-services';

function formatValue(value: any): string {
    if (value === null || value === undefined) {
        return ''
    }
    
    if (Array.isArray(value)) {
        // Si es un array, convertirlo a JSON string con formato legible
        return JSON.stringify(value, null, 2)
    }
    
    if (typeof value === 'object') {
        // Si es un objeto, convertirlo a JSON string con formato legible
        return JSON.stringify(value, null, 2)
    }
    
    return String(value)
}

interface FlattenedData {
    [key: string]: string;
    id: string;
    repoName: string;
    phone: string;
    functionName: string;
    createdAt: string;
}

function sanitizeSheetName(name: string): string {
    // Remover caracteres inválidos para nombres de hojas en Excel
    let safeName = name.replace(/[\\/?*[\]]/g, '')
    
    // Truncar a 31 caracteres máximo
    if (safeName.length > 31) {
        safeName = safeName.substring(0, 28) + '...'
    }
    
    return safeName
}

export async function exportRepoData(agencySlug: string, clientSlug: string, repoName: string, startStr?: string, endStr?: string) {
    const client = await getClientDAOBySlugs(agencySlug, clientSlug)
    if (!client) {
        throw new Error('Client not found')
    }
    const data = await getFullRepoDatasDAO(client.id, startStr, endStr, repoName)
    
    // Procesamos los datos para aplanar la estructura
    const flattenedData = data.map(item => {
        // Convertimos el string data a objeto
        const dataObj = JSON.parse(item.data as string || '{}')
        
        // Creamos el objeto base con los campos principales
        const baseObject = {
            id: item.id,
            repoName: item.repoName,
            phone: item.phone,
            functionName: item.functionName,
            createdAt: item.createdAt.toISOString(),
        }

        // Procesamos cada valor del dataObj para manejar arrays y objetos
        const processedDataObj = Object.entries(dataObj).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: formatValue(value)
        }), {})

        // Combinamos el objeto base con los campos de data procesados
        return {
            ...baseObject,
            ...processedDataObj
        } as FlattenedData
    })

    // Obtenemos todas las columnas únicas
    const allColumns = new Set<string>()
    flattenedData.forEach(item => {
        Object.keys(item).forEach(key => allColumns.add(key))
    })

    // Convertimos el Set a Array y ordenamos las columnas
    // Primero los campos base, luego los campos de data alfabéticamente
    const baseColumns = ['id', 'repoName', 'phone', 'functionName', 'createdAt']
    const dataColumns = Array.from(allColumns)
        .filter(col => !baseColumns.includes(col))
        .sort()
    const columns = [...baseColumns, ...dataColumns]

    // Creamos una matriz con los datos ordenados según las columnas
    const excelData = [
        columns, // Primera fila con los nombres de las columnas
        ...flattenedData.map(item => 
            columns.map(col => item[col] || '') // Para cada columna, obtener el valor o vacío si no existe
        )
    ]

    // Crear el libro de Excel
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(excelData)

    // Ajustar el ancho de las columnas
    const maxWidth = 50 // Máximo ancho en caracteres
    const colWidths = columns.map(col => {
        const maxContentLength = Math.max(
            col.length,
            ...flattenedData.map(item => {
                const content = String(item[col] || '')
                // Calculamos el ancho basado en la línea más larga si hay múltiples líneas
                return Math.min(maxWidth, 
                    Math.max(...content.split('\n').map(line => line.length))
                )
            })
        )
        return { wch: maxContentLength }
    })
    ws['!cols'] = colWidths

    // Ajustar el alto de las filas para acomodar contenido multilínea
    const rowHeights = excelData.map(row => {
        const maxLines = Math.max(...row.map(cell => 
            String(cell).split('\n').length
        ))
        return { hpt: maxLines * 15 } // 15 puntos por línea
    })
    ws['!rows'] = rowHeights

    // Agregar la hoja al libro con nombre sanitizado
    const sheetName = sanitizeSheetName(repoName)
    XLSX.utils.book_append_sheet(wb, ws, sheetName)

    // Generar el archivo Excel
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

    return excelBuffer
}
