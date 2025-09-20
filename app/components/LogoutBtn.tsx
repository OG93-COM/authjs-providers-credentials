"use client"
import { signOut } from 'next-auth/react'


export default function LogoutBtn() {
  return (
    <button onClick={()=> signOut()} className='mt-5 text-md text-white font-bold text-center bg-slate-700 p-2 rounded-md cursor-pointer hover:bg-red-600'>
        Déconnexion
    </button>
  )
}
