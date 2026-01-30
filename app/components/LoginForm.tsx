"use client"
import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast';
import { loginAction } from '@/libs/actions/auth.action'
import AlertLogin from './AlertLogin'
import SignInBtn from './SignInBtn'
import { Eye, EyeClosed } from 'phosphor-react'
import { loginSchema } from '@/libs/validationSchema';

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [clientErrors, setClientErrors] = useState("");
    const [serverError, setServerError] = useState("");
    const [serverSuccess, setServerSuccess] = useState("");
    const [isPending, startTransition] = useTransition();

    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showTwoStep, setShowTwoStep] = useState<boolean>(false)
    const [code, setCode] = useState("")

    const handleLoginSubmit = (e : React.FormEvent)  => {
        e.preventDefault()
        try {
            startTransition( async ()=>{
                const validation = loginSchema.safeParse({ email, password, code });
                if (!validation.success) {
                    if(validation.error.issues[0].message === "Email ou Mot de pass invalide"){
                        setShowTwoStep(false)
                    }
                    return setClientErrors(validation.error.issues[0].message);
                }

                loginAction({ email, password, code }).then((result)=>{
                    if (!result.success) {
                        setServerError(result.message)
                        setServerSuccess("")
                        return
                    } else if (result.success) {
                        setShowTwoStep(true)
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
                            {!showTwoStep ? (
                            <>
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
                            </>
                            ):(
                            <div>
                                <label htmlFor="twoStepCode" className="block mb-2 text-sm font-medium text-gray-900 ">Ajouter Votre Code</label>
                                <input type="text" name="twoStepCode" id="twoStepCode" maxLength={6} placeholder="000000"
                                    className="bg-gray-50 border-2 border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-[#035ab6] focus:border-[#035ab6] block w-full p-3 text-center text-2xl font-bold tracking-[0.5em] font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    disabled={isPending}/>
                            </div>
                            )}

                            <button disabled={isPending} type="submit"
                            className="w-full btn-orange text-sm disabled:bg-slate-500">
                            {isPending ? "Loading ..." : (showTwoStep ? "Valider" : "Se Connecter")}
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
)}
