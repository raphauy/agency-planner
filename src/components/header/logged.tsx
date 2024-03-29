import { getCurrentUser } from "@/lib/utils";
import PopOverUserHandler from "./PopOverUserHandler"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "../ui/button"
import Link from "next/link"

export default async function Logged() {

    const user= await getCurrentUser()
    if (!user) {
        return (
            <Link href="/auth/login">
                <Button>Login</Button>
            </Link>
        )
    }

    return (
        <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost">{user.email}</Button>
        </PopoverTrigger>
        <PopoverContent className="rounded-2xl border py-3 w-fit bg-white shadow-xl mr-3">
            <PopOverUserHandler user={user}/>
        </PopoverContent>
        </Popover>

    )
}
