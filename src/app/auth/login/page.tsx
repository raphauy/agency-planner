import { getCurrentUser } from "@/lib/utils";
import { LoginForm } from "./login-form";
import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    email: string
  }
}
export default async function LoginPage({ searchParams }: Props) {
  const requestEmail= searchParams.email

  console.log("email", requestEmail)


  const user= await getCurrentUser()
  if (user) redirect("/")

  return (
    <LoginForm requestedEmail={requestEmail} />
  )
}
