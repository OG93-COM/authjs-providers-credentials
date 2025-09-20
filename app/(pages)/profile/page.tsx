import LogoutBtn from '@/app/components/LogoutBtn'
import { auth } from '@/libs/auth'

export default async function page() {
    const session = await auth()

  return (
    <div className='w-full text-center mt-5'>
        {session && (
        <>
        <p>{session?.user?.email}</p>
        <p>{session?.user?.name}</p>
        </>
      )}
      {session && <LogoutBtn/> }
    </div>
  )
}
