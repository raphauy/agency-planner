import { getAllCommentsDAO } from "@/services/comment-services"
import { columns } from "./comment-columns"
import { DataTable } from "./comment-table"

export default async function CommentPage() {
  
  const data= await getAllCommentsDAO()

  return (
    <div className="w-full">      

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Comment"/>      
      </div>
    </div>
  )
}
  
