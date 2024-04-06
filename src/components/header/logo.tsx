import { getCurrentUser } from "@/lib/utils";
import Link from "next/link";


export default async function Logo() {

  const user= await getCurrentUser()
  return (
    <>
      {
        user ? (
        <Link href="/">
          <div className="text-4xl font-bold flex items-center pb-1 pl-3">
            <p className="text-gray-700">a</p>
            <p className="text-gray-300">p</p>
          </div>
        </Link> ) : (
          <Link href="/">
          <div className="text-2xl font-bold pl-3 flex py-2">
            <p className="text-gray-700 whitespace-nowrap">agency-planner</p>
            <p className="text-gray-300">.com</p>
          </div>
        </Link>
    
        )
      }
    </>
  )  
}
