"use client"

import AlertLogin from "@/app/components/AlertLogin";
import { resetPasswordAction } from "@/libs/actions/resetPassword.action";
import { resetVerificationPasswordSchema } from "@/libs/validationSchema";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("")
    const [clientErrors, setClientErrors] = useState("");
    const [serverError, setServerError] = useState("");
    const [serverSuccess, setServerSuccess] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleResetPawssordSubmit = (e : React.FormEvent)  => {
        e.preventDefault()
        try {
            startTransition( async ()=>{
                const formData = { email };
                const validation = resetVerificationPasswordSchema.safeParse(formData);

                if (!validation.success) {
                    // Récupérer les erreurs
                    const fieldErrors = (validation.error.issues[0].message);
                    setClientErrors(fieldErrors);
                    setServerSuccess("");
                    return;
                }


                resetPasswordAction(formData).then((result)=>{
                    if (!result.success) {
                        setServerError(result.message)
                        setServerSuccess("")
                        return
                    } else if (result.success) {
                        setEmail("");
                        setServerError("");
                        setClientErrors("");
                        setServerSuccess(result.message)
                    };
                })


        }) }catch(err) {
            toast.error("Désolé, il y a un problème 😭")
            console.log(err)
            }
    }

  return (
    <div className="w-full bg-white/80 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                      <form className="space-y-4 md:space-y-6" onSubmit={handleResetPawssordSubmit}>
                          <div>
                              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Votre email</label>
                              <input type="email" name="email" id="email" placeholder="name@company.com"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 mb-[-15px]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isPending}/>
                          </div>

                          { (clientErrors || serverError) && <AlertLogin type="error" message={clientErrors || serverError} />}
                          {serverSuccess && <AlertLogin type="success" message={serverSuccess} />}

                          <button disabled={isPending} type="submit"
                          className="w-full btn-orange text-sm disabled:bg-slate-500 cursor-pointer">
                          {isPending ? "Veuillez Patienter 😊" : "Reset votre mot de passe"}
                          </button>



                          <p className="text-sm font-light text-gray-500">
                            <Link href="/login" className="font-medium text-[#1488CC] hover:underline">Retour à la page de connexion</Link>
                          </p>
                      </form>


                  </div>
              </div>
  )
}

export default ForgotPasswordForm