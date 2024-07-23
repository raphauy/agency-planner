"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { LoginSchema } from "@/services/login-services";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FormError } from "./_components/form-error";
import { FormSuccess } from "./_components/form-success";
import { loginAction } from "./actions";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";


type Props = {
  requestedEmail?: string
}

export function LoginForm({ requestedEmail }: Props) {

  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email already in use with different provider!"
    : ""

  const [showOTP, setShowOTP] = useState(false)
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()
  const [resendSeconds, setResendSeconds] = useState(-1)
  const [shouldResend, setShouldResend] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: requestedEmail || "",      
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    
    startTransition(() => {
      if (showOTP && !values.code) {
        setError("Por favor ingrese el código de verificación")
        return;
      }
      loginAction(values)
        .then((data) => {
          console.log("loginAction", data)
          
          if (data?.error) {
            console.log("data?.error", data.error)
            
            form.reset();
            setError(data.error)
            form.setValue("email", values.email)
            toast({ title: data.error, variant: "destructive" })
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success)
          }

          if (data?.code) {
            setShowOTP(true)
            form.setValue("email", values.email)
            setResendSeconds(60)
          }

          if (!data?.success && !data?.error && !data?.code) {
            console.log("user logged in")
            window.location.reload()
          }
          
        })
        .catch(() => setError("Algo salió mal en la autenticación!"));
    });
  };

  useEffect(() => {
    if (!showOTP || resendSeconds < 0)
      return
    console.log("counting...")
    

    const second = setTimeout(() => {
      setResendSeconds(resendSeconds - 1)
    }, 1000)

    return () => {
      clearTimeout(second)
    }
  }, [showOTP, resendSeconds])

  useEffect(() => {
    if (shouldResend && !showOTP) {
      form.handleSubmit(onSubmit)()
      setShouldResend(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOTP, shouldResend])

  function handleResend() {
    setShowOTP(false)
    setSuccess("")
    setError("")
    setShouldResend(true)
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-[450px] p-10 rounded-2xl bg-white dark:bg-black dark:shadow-gray-100 dark:shadow-xl border shadow-2xl"
      >
        <div className="mb-7 w-full text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2"><p className="font-bold text-4xl text-center">Login</p><p className="text-2xl">🔐</p></div>
          <p className="font-bold text-center mb-10">Bienvenido a Agency Planner</p>
          {showOTP && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem  className="flex flex-col items-center">
                  <FormLabel>Código de acceso</FormLabel>
                  <FormControl className="w-full ">
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <p>-</p>
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Ingresa el código enviado a {form.getValues("email")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />            )}
          {!showOTP && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                      <Input                        
                        {...field}
                        disabled={isPending}
                        placeholder="john.doe@ejemplo.com"
                        type="email"
                      />
                    </FormControl>
                    <FormDescription className="pt-3">
                      Te enviaremos un email con un código de acceso
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
          )}
        </div>
        <div className={cn("h-12 min-h-12", !showOTP && "hidden")}>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
        </div>
        <div className="h-12 min-h-12">
          {showOTP && resendSeconds > 0 && (
            <div className="text-center">Reintentar en {resendSeconds}</div>
          )}
          {showOTP && resendSeconds < 0 && (
            <Button variant="link" type="button" onClick={handleResend} className="w-full">
              Reenviar código
            </Button>
          )}
        </div>
        <Button disabled={isPending} type="submit" className="w-full">
          {showOTP ? "Confirmar" : isPending ? <Loader className="w-6 h-6 animate-spin" /> : "Enviar código"}
        </Button>
      </form>
    </Form>

  );
};
