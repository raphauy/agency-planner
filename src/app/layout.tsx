
import { TailwindIndicator } from '@/components/shadcn/tailwind-indicator';
import { ThemeProvider } from '@/components/shadcn/theme-provider';
import { LinealToggle } from '@/components/shadcn/toggle-theme';
import { Toaster } from '@/components/ui/toaster';
import { auth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Agency Planner",
  description: "A strategic content planner for agencies.",
  openGraph: {
    title: "Agency Planner",
    description: "A strategic content planner for agencies.",
    type: "website",
    url: "https://agency-planner.com",
    images: [
      {
        url: "https://agency-planner.com/agency-planner-logo.png",
        width: 282,
        height: 45,
        alt: "Agency Planner",
      },
    ],
  },
};

type Props = {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
  const session = await auth();
  const isDevMode = process.env.NODE_ENV === "development";

  return (
    <SessionProvider session={session}>
      <html lang="es" suppressHydrationWarning>
        <body className={cn(inter.className, "flex flex-col")}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>            
            <div className='flex-1'>
              {children}
              <Analytics />
            </div>
            <div className='self-end w-full dark:bg-black'>
              <LinealToggle isDevMode={isDevMode} />
            </div>
            <TailwindIndicator />
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  )
}