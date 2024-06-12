"use client"

import { signOut, useSession } from "next-auth/react";

import { Clipboard, ExternalLink, LayoutDashboard, LockKeyhole, LogOut, User } from "lucide-react";
import Link from "next/link";
import { ExtendedUser } from "@/next-auth";
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";


type Props = {
  user: ExtendedUser | null;
};
export default function PopOverUserHandler({ user }: Props) {

  const router= useRouter()
  if (!user)
    return <div></div>
  
  async function onLogout(){
    
    // await signOut({ redirect: false })
    // router.refresh()
    // router.push("/auth/login")
    await signOut()

  }
      
  return (
    <>
      <nav className="flex flex-col mt-1 text-sm text-gray-600 min-w-[220px]">
        <ul>
          <li className="flex items-center gap-2 px-2 pt-2 ml-1">
            <User /> {user.email} 
          </li>

          <div className="border-b mx-4 my-2" />

          <li className="flex items-center gap-2 px-2 pt-2 ml-1">
            {getLabel(user.role)}
          </li>

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

function getLabel(role: UserRole) {
  switch (role) {
    case 'ADMIN':
      return 'Admin'
    case 'AGENCY_OWNER':
      return 'Dueño de Agencia'
    case 'AGENCY_ADMIN':
      return 'Administrador de Agencia'
    case 'AGENCY_CREATOR':
      return 'Creador de contenido'
    case 'CLIENT_ADMIN':
      return 'Administrador de Cliente'
    case 'CLIENT_USER':
      return 'Rol: Cliente'
    default:
      return 'Invitado'
  }
}