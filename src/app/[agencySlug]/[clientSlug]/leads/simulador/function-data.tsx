import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import Link from "next/link"

interface Props {
    toolResultStr: string
}

export default function FunctionData({ toolResultStr }: Props) {

    if (!toolResultStr) return null

    const toolResult= JSON.parse(toolResultStr)
    const toolName= toolResult.toolName

    if (toolName === "obtenerDocumento") {
        const docId= toolResult.args.documentId
        const docName= toolResult.result.documentName
        return (
            <div className="flex items-center w-full gap-2 p-2 border rounded-md border-blue-500">
                <BookOpen size={20} color="blue"/>
                <Link className="flex px-1" href={`/d/${docId}`} target="_blank">
                    <Button variant="link" className="h-6"><p>{docName}</p></Button>
                </Link>
            </div>
        )        
    } else {
        const repoFields= toolResult.args
        return <p>{JSON.stringify(repoFields)}</p>
        // const jsonReplaced = JSON.stringify(repoFields, (key, value) => {
        //     if (value === true) return "SI"
        //     if (value === false) return "NO"
        //     return value;
        //   }, 2)

        //   return (
        //     <div className={cn("flex items-center w-full gap-2 p-2 border rounded-md border-red-500")}>
        //         <div>
        //             <Database size={20} className="text-red-500" />
        //         </div>
        //         <p className="mr-4 font-bold">{toolName}</p>
        //         {/* <CodeBlock code={jsonReplaced} showLineNumbers={false} />                 */}
        //     </div>
        // )        
    }

}

const example = { 
    "type": "tool-result", 
    "toolCallId": "call_EOVRUWlMFHE6P3u5FQ7gPRsg", 
    "toolName": "obtenerDocumento", 
    "args": { 
        "documentId": "cm2iy97cm000711jyg28q8xeq" 
    }, "result": { 
        "documentId": "cm2iy97cm000711jyg28q8xeq", 
        "documentName": "Menú semanal de Cantina Barreiro", 
        "documentDescription": "Aquí están todas las opciones de menú de cada día.", 
        "content": "Menú Semanal de la Cantina\n\nLunes\n\n\n\n\n\nOpción 1: Lentejas estofadas con chorizo, acompañadas de arroz blanco y ensalada verde.\n\n\n\nOpción 2: Pechuga de pollo a la plancha con puré de papas y zanahorias al vapor.\n\n\n\nOpción 3: Pasta penne al pesto con tomates cherry y queso parmesano.\n\nMartes\n\n\n\n\n\nOpción 1: Albóndigas en salsa de tomate con espagueti y queso rallado.\n\n\n\nOpción 2: Salmón al horno con costra de hierbas, acompañado de arroz integral y espárragos salteados.\n\n\n\nOpción 3: Risotto de setas con queso de cabra y ensalada de rúcula.\n\nMiércoles\n\n\n\n\n\nOpción 1: Guiso de garbanzos con espinacas, acompañado de pan de ajo.\n\n\n\nOpción 2: Filete de cerdo en salsa de mostaza, con puré de manzana y verduras al horno.\n\n\n\nOpción 3: Ensalada César con pollo, croutons, queso parmesano y aderezo César.\n\nJueves\n\n\n\n\n\nOpción 1: Chili con carne, servido con arroz blanco y nachos.\n\n\n\nOpción 2: Merluza al vapor con salsa verde, patatas cocidas y guisantes.\n\n\n\nOpción 3: Quiche de espinacas y queso feta, con ensalada mixta.\n\nViernes\n\n\n\n\n\nOpción 1: Paella mixta con mariscos, pollo y verduras.\n\n\n\nOpción 2: Hamburguesa de ternera con queso, lechuga, tomate, cebolla caramelizada, servida con patatas fritas.\n\n\n\nOpción 3: Curry de verduras con arroz basmati y pan naan.\n\nSábado\n\n\n\n\n\nOpción 1: Tacos de carnitas con salsa verde, cebolla, cilantro y lima.\n\n\n\nOpción 2: Bacalao a la vizcaína con pimientos rojos y arroz blanco.\n\n\n\nOpción 3: Ensalada de quinoa con aguacate, tomate, pepino, cebolla morada y vinagreta de limón.\n\nDomingo\n\n\n\n\n\nOpción 1: Asado de tira con chimichurri, papas asadas y ensalada de tomate.\n\n\n\nOpción 2: Lasagna de carne y ricotta, con pan de ajo y ensalada verde.\n\n\n\nOpción 3: Ratatouille con queso de cabra, servido con pan rústico." 
    } 
}