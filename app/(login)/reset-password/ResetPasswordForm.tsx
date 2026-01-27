"use client"

import AlertLogin from "@/app/components/AlertLogin";
import { changePasswordAction } from "@/libs/actions/resetPassword.action";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeClosed } from "phosphor-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";

const ResetPasswordForm = () => {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [clientErrors, setClientErrors] = useState("");
    const [serverError, setServerError] = useState("");
    const [serverSuccess, setServerSuccess] = useState("");

    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

    const [isPending, startTransition] = useTransition();

    const params = useSearchParams();
    const token = params.get("token")

    const handleResetPawssordSubmit = (e : React.FormEvent)  => {
        e.preventDefault()
        try {
            startTransition( async ()=>{
                if(newPassword !== confirmPassword) {
                    setClientErrors("Mot de passe ne sont pas identique")
                }

                if(!token) return setClientErrors("Token non trouvé, Réessayer!")

              changePasswordAction({newPassword}, token).then((result)=>{
                  if (!result.success) {
                      setServerError(result.message)
                      setServerSuccess("")
                      return
                  } else if (result.success) {
                      setServerError("");
                      setClientErrors("");
                      setNewPassword("")
                      setConfirmPassword("")
                      setServerSuccess(result.message)
                  };
              })


        }) }catch(err) {
            toast.error("Désolé, il y a un problème 😭")
            console.log(err)
            }
    }

    useEffect(() => {
      if (showPassword) {
          const timer = setTimeout(() => {
              setShowPassword(false);
              setShowConfirmPassword(false);
          }, 10000); // 10 secondes
          // Cleanup: annule le timer si le composant est démonté ou si showPassword change
          return () => clearTimeout(timer);
      }
  }, [showPassword, showConfirmPassword]);

  return (
    <div className="w-full bg-white/80 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                      <form className="space-y-4 md:space-y-6" onSubmit={handleResetPawssordSubmit}>
                          <div className="relative">
                              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Votre Mot de passe</label>
                              <input type={showPassword ? "text" : "password"} name="password" id="password" placeholder="*********"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 mb-[-15px]"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={isPending}/>
                                {showPassword ? <EyeClosed size={22} color='grey' className='absolute right-3 top-10 cursor-pointer' onClick={()=> setShowPassword(prev => !prev)}/>
                                  :  <Eye size={22} color='grey' className='absolute right-3 top-10 cursor-pointer animate-pulse duration-200' onClick={()=> setShowPassword((prev) => !prev)}/>
                                }
                          </div>
                          <div className="relative">
                              <label htmlFor="comfirmedPassword" className="block mb-2 text-sm font-medium text-gray-900 ">Comfirmer Votre Mot de passe</label>
                              <input type={showConfirmPassword ? "text" : "password"} name="comfirmedPassword" id="email" placeholder="*********"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 mb-[-15px]"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isPending}/>
                                {showConfirmPassword ? <EyeClosed size={22} color='grey' className='absolute right-3 top-10 cursor-pointer' onClick={()=> setShowConfirmPassword(prev => !prev)}/>
                                  :  <Eye size={22} color='grey' className='absolute right-3 top-10 cursor-pointer animate-pulse duration-200' onClick={()=> setShowConfirmPassword((prev) => !prev)}/>
                                }
                          </div>

                          { (clientErrors || serverError) && <AlertLogin type="error" message={clientErrors || serverError} />}
                          {serverSuccess && <AlertLogin type="success" message={serverSuccess} />}

                          <button disabled={isPending} type="submit"
                          className={`w-full btn-orange text-sm cursor-pointer ${isPending && "bg-slate-600"}`}>
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

export default ResetPasswordForm