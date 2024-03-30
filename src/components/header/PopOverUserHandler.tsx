"use client"

import { signOut, useSession } from "next-auth/react";

import { Clipboard, ExternalLink, LayoutDashboard, LockKeyhole, LogOut, User } from "lucide-react";
import Link from "next/link";
import { ExtendedUser } from "@/next-auth";
import { useRouter } from "next/navigation";


type Props = {
  user: ExtendedUser | null;
};
export default function PopOverUserHandler({ user }: Props) {

  const router= useRouter()
  if (!user)
    return <div></div>
  
  async function onLogout(){
    
    await signOut({ redirect: false })
    router.refresh()
    router.push("/auth/login")
  }
      
  return (
    <>
      <nav className="flex flex-col mt-1 text-sm text-gray-600 min-w-[220px]">
        <ul>
          <li className="flex items-center gap-2 px-2 pt-2 ml-1">
            <User /> {user.email} 
          </li>

          <div className="border-b mx-4 my-2" />

          {user.role === 'ADMIN' && <AdminMenu />}

          <div className="border-b mx-4 mb-2 mt-16" />

          <li className="w-full hover:bg-gray-200">
            <div onClick={onLogout} 
              className="flex items-center flex-grow px-4 py-2 justify-between cursor-pointer">
              <p>Logout</p> <LogOut size={20}/>
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
}

function AdminMenu() {
  return (
    <>
      <li className="w-full hover:bg-gray-200">
        <Link href="/admin" className="flex items-center flex-grow justify-between px-4 py-2 rounded-md cursor-pointer  ">
          <p>Admin</p><LockKeyhole size={20}/>
        </Link>
      </li>
      <li className="w-full hover:bg-gray-200">
        <Link href="/admin/tablero" className="flex items-center flex-grow justify-between px-4 py-2 rounded-md cursor-pointer  ">
          <p>Tablero Admin</p><Clipboard size={20}/>
        </Link>
      </li>
      <div className="border-b mx-4 my-2" />
    </>
  );
}
