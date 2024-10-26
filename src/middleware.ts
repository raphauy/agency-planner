import NextAuth from "next-auth"
import authConfig from "@/lib/auth.config"
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "@/routes"
import { NextResponse } from "next/server"
import { headers } from "next/headers"
  
const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req

    const isLoggedIn = !!req.auth
    //console.log('isLoggedIn', isLoggedIn)

    const publicDomain= process.env.NEXT_PUBLIC_URL?.split('//')[1]
    let hostname = req.headers
    let subdomain = hostname.get('host')?.split(`${publicDomain}`).filter(Boolean)[0]
    subdomain= subdomain?.split(".").slice(0, -1).join(".")
    const isSubdomainHomepage= subdomain && nextUrl.pathname === "/"
    if (isSubdomainHomepage && !subdomain?.startsWith("local")) {
        return NextResponse.rewrite(new URL(`/${subdomain}`, req.url))
    }    

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  
    if (isApiAuthRoute) {
        return
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        return
    }

    if (!isLoggedIn && !isPublicRoute) {

        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = (callbackUrl && callbackUrl !== "/") ? "?callbackUrl=" + encodeURIComponent(callbackUrl) : "";

        return Response.redirect(new URL(`/auth/login${encodedCallbackUrl}`, nextUrl))
    }

    // if (subdomain) {
    //     const searchParams = nextUrl.searchParams.toString()
    //     const path = nextUrl.pathname
        
    //     if (path.startsWith("/auth"))
    //         return
        
    //     const newPath = "/" + path.split('/').filter(Boolean).slice(1).join('/')
    //     const pathWithSearchParams = `${newPath}${searchParams.length > 0 ? `?${searchParams}` : ''}`

    //     subdomain= subdomain.substring(0, subdomain.length - 1)
    //     return NextResponse.rewrite(new URL(`/${subdomain}${pathWithSearchParams}`, req.url))
    // }
    

    return
})

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}