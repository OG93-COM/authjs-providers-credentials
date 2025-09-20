import NextAuth from "next-auth";
import edgeAuthConfig from "@/libs/auth.config.edge";
import { NextResponse } from "next/server";
import { boolean } from "zod";

const { auth: middleware } = NextAuth(edgeAuthConfig);


export default middleware((req) => {
    const isUserLoggedIn : boolean = Boolean(req.auth)
    console.log("Page : ", req.nextUrl.pathname)
    if(isUserLoggedIn && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register") ) return NextResponse.redirect(new URL("/profile", req.nextUrl))
    if(!isUserLoggedIn && req.nextUrl.pathname === "/profile" ) return NextResponse.redirect(new URL("/login", req.nextUrl))

})

export const config = {
  matcher: ["/login", "/register", "/profile"],
};
