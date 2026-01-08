"use client"
import { signOut } from 'next-auth/react'
import { SignOut } from 'phosphor-react'


export default function LogoutBtn() {
  return (
    <button onClick={()=> signOut()} className='text-sm text-white font-bold text-center bg-slate-700 p-2 rounded-md cursor-pointer hover:bg-red-600'>
        <SignOut size={20} />
    </button>
  )
}
