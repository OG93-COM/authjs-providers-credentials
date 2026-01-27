import NextAuth from "next-auth";
import edgeAuthConfig from "@/libs/auth.config.edge";
import { NextResponse } from "next/server";

const { auth: middleware } = NextAuth(edgeAuthConfig);


export default middleware((req) => {
    const publicPath = ["/login", "/register", "/reset-password", "/forgot-password"]
    const securedPath = ["/profile"]
    const isUserLoggedIn : boolean = Boolean(req.auth)
    console.log("Page From Middleware : ", req.nextUrl.pathname)
    if(isUserLoggedIn &&  publicPath.includes(req.nextUrl.pathname) ) return NextResponse.redirect(new URL("/profile", req.nextUrl))
    if(!isUserLoggedIn && securedPath.includes(req.nextUrl.pathname) ) return NextResponse.redirect(new URL("/login", req.nextUrl))

})

export const config = {
  matcher: ["/login", "/register", "/profile", "/reset-password", "/forgot-password"],
};
