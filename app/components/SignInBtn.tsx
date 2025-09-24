"use client"
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FacebookLogo, GithubLogo, GoogleLogo, X } from "phosphor-react";
import React from "react";


const SignInBtn = () => {


  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    OAuthAccountNotLinked: "Un autre compte existe déjà avec cet e-mail. Connectez-vous avec le bon fournisseur.",
    CredentialsSignin: "Email ou mot de passe invalide.",
    AccessDenied: "Accès refusé.",
    Default: "Une erreur est survenue, veuillez réessayer.",
  };

  const errorMessage = error ? errorMessages[error] ?? errorMessages.Default : null;

  return (
    <>
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
    {errorMessage && (
      <div className="mt-4 px-4 py-2 rounded bg-red-100 text-red-700">
        {errorMessage}
      </div>
    )}
    </>

  );
};

export default SignInBtn;
