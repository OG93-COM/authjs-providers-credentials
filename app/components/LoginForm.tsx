"use client"
import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { loginAction } from '@/libs/actions/auth.action'
import AlertLogin from './AlertLogin'
import SignInBtn from './SignInBtn'
import { Eye, EyeClosed } from 'phosphor-react'

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [clientErrors, setClientErrors] = useState("");
    const [serverError, setServerError] = useState("");
    const [serverSuccess, setServerSuccess] = useState("");
    const [isPending, startTransition] = useTransition();

    const [showPassword, setShowPassword] = useState<boolean>(false)

    const handleLoginSubmit = (e : React.FormEvent)  => {
        e.preventDefault()
        try {
            startTransition( async ()=>{
                const formData = { email, password };
                // const validation = loginSchema.safeParse(formData);


                loginAction(formData).then((result)=>{
                    if (!result.success) {
                        setServerError(result.message)
                        setServerSuccess("")
                        return
                    } else if (result.success) {
                        setEmail("");
                        setPassword("");
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

    useEffect(() => {
        if (showPassword) {
            const timer = setTimeout(() => {
                setShowPassword(false);
            }, 10000); // 10 secondes
    
            // Cleanup: annule le timer si le composant est démonté ou si showPassword change
            return () => clearTimeout(timer);
        }
    }, [showPassword]);

  return (
    <div className="w-full bg-white/80 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                      <form className="space-y-4 md:space-y-6" onSubmit={handleLoginSubmit}>
                          <div>
                              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Votre email</label>
                              <input type="email" name="email" id="email" placeholder="name@company.com"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isPending}/>
                          </div>

                          <div className='relative'>
                              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Mot de Passe</label>
                              <input type={showPassword ? "text" : "password"} name="password" id="password" placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isPending}/>
                                {showPassword ? <EyeClosed size={22} color='grey' className='absolute right-3 top-10 cursor-pointer' onClick={()=> setShowPassword(prev => !prev)}/>
                                  :  <Eye size={22} color='grey' className='absolute right-3 top-10 cursor-pointer animate-pulse duration-200' onClick={()=> setShowPassword((prev) => !prev)}/>
                                }
                          </div>

                          <button disabled={isPending} type="submit"
                          className="w-full btn-orange text-sm disabled:bg-slate-500">
                          {isPending ? "Loading ..." : "Se Connecter"}
                          </button>

                          { (clientErrors || serverError) && <AlertLogin type="error" message={clientErrors || serverError} />}
                          {serverSuccess && <AlertLogin type="success" message={serverSuccess} />}

                          <div className="flex items-center justify-end">
                              <Link href="/forgot-password" className="text-sm font-medium text-orange-600 hover:underline">Mot de passe oublié?</Link>
                          </div>

                          <SignInBtn/>

                          <p className="text-sm font-light text-gray-500">
                          Vous n’avez pas de compte ? <Link href="/register" className="font-medium text-[#1488CC] hover:underline">Inscrivez-vous</Link>
                          </p>
                      </form>


                  </div>
              </div>
  )
}
