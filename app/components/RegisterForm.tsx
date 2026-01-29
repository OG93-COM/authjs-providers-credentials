"use client"
import React, { useState, useTransition } from "react";
import SignInBtn from "./SignInBtn";
import Link from "next/link";
import { registerSchema } from "@/libs/validationSchema";
import { registerAction } from "@/libs/actions/auth.action";
import { toast } from "react-toastify";
import AlertLogin from "./AlertLogin";
import { redirect } from "next/navigation";
import { Eye, EyeClosed } from "phosphor-react";

export default function LoginForm() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [clientErrors, setClientErrors] = useState("");
    const [serverError, setServerError] = useState("");
    const [serverSuccess, setServerSuccess] = useState("");
    const [isPending, startTransition] = useTransition();

    const [showPassword, setShowPassword] = useState<boolean>(false)


    const handleRegisterSubmit = (e : React.FormEvent)  => {
        e.preventDefault();
        try {
            startTransition( async ()=>{
                const formData = {name, email, password };
                const validation = registerSchema.safeParse(formData);

                if (!validation.success) {
                    // Récupérer les erreurs
                    const fieldErrors = (validation.error.issues[0].message);
                    setClientErrors(fieldErrors);
                    setServerSuccess("");
                    return;
                }

                registerAction({name, email, password}).then((result)=>{
                    if (result.success) {
                        setName("");
                        setEmail("");
                        setPassword("");
                        setServerError("");
                        setClientErrors("");
                        setServerSuccess(result.message);
                        toast.success("Register, Welcome User");

                     } else if (!result.success) {
                        setServerError(result.message)
                        };
                    console.log(result?.message)
                })

        }) }catch(err) {
          console.log(err)
            toast.error("Désolé, il y a un problème 😭")
            }
    }

  return (
    <div className="w-full bg-white/80 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <form className="space-y-4 md:space-y-6" onSubmit={handleRegisterSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 ">Votre Nom</label>
            <input
              type="text"
              name="name"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
              placeholder="Nom complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}/>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 ">Votre email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}/>
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"> Mot de Passe </label>
            <input type={showPassword ? "text" : "password"} name="password" id="password" placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2 "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}/>
              {showPassword ? <EyeClosed size={22} color='grey' className='absolute right-3 top-10 cursor-pointer' onClick={()=> setShowPassword(prev => !prev)}/>
                  :  <Eye size={22} color='grey' className='absolute right-3 top-10 cursor-pointer animate-pulse duration-200' onClick={()=> setShowPassword((prev) => !prev)}/>
              }
          </div>
          
            { (clientErrors || serverError) && <AlertLogin type="error" message={clientErrors || serverError} />}
            {serverSuccess && <AlertLogin type="success" message={serverSuccess} />}
            <button disabled={isPending} type="submit" className="w-full btn-orange text-sm disabled:bg-slate-500">
                {isPending ? "Loading..." : "Créer un compte"}
            </button>

          <SignInBtn />
          <p className="text-sm font-light text-gray-500">
            Vous avez déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-medium text-[#1488CC] hover:underline"
            >
              Connectez-vous
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
