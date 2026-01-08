import { auth } from '@/libs/auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import LogoutBtn from './LogoutBtn'

export default async function Nav() {

  const session = await auth()


  return (

<nav className="bg-slate-900 border-gray-200 shadow-md w-full">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <div className='text-4xl text-white'>NextAuth</div>
    <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-slate-100 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 " aria-controls="navbar-default" aria-expanded="false">
        <span className="sr-only">Open main menu</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    </button>
    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
      <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  ">
        <li>
          <Link href="/" className="block py-2 px-3 text-slate-100 rounded-sm md:bg-transparent  md:p-0 " aria-current="page">Home</Link>
        </li>
        {session ? (
        <>
        <li>
          <Link href="/profile" className="block py-2 px-3 text-slate-100 rounded-sm md:bg-transparent  md:p-0 " aria-current="page">Profile</Link>
        </li>
        <li> 
          <LogoutBtn/>
        </li>
        </>
        ) : (
        <li>
          <Link href="/login" className="block py-2 px-3 text-slate-100 rounded-sm md:bg-transparent  md:p-0 " aria-current="page">Login</Link>
        </li>
        )}
        
        
        
      </ul>
    </div>
  </div>
</nav>

  )
}
