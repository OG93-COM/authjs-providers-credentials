"use client"
import { signIn } from "next-auth/react";
import { FacebookLogo, GithubLogo, GoogleLogo, X } from "phosphor-react";
import React from "react";


const SignInBtn = () => {
  return (
    <div className="flex justify-center items-center gap-4">
      <div onClick={() => signIn("facebook", { redirectTo: "/profile" })} className="btn-singin-platform">
        <FacebookLogo size={30} color="#316FF6" />
      </div>
      <div onClick={() => signIn("google", { redirectTo: "/profile" })} className="btn-singin-platform">
        <GoogleLogo size={30} />
      </div>
      <div onClick={() => signIn("github", { redirectTo: "/profile" })} className="btn-singin-platform">
        <GithubLogo size={30} />
      </div>
      <div onClick={() => signIn("twitter", { redirectTo: "/profile" })} className="btn-singin-platform">
        <X size={30} />
      </div>
    </div>
  );
};

export default SignInBtn;
