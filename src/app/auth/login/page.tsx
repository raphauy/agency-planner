import { getCurrentUser } from "@/lib/utils";
import { LoginForm } from "./login-form";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user= await getCurrentUser()
  if (user) redirect("/")
  return (
    <LoginForm />
  )
}
