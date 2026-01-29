import { auth } from '@/libs/auth'
import Image from 'next/image';
import ToggleTwoStep from './ToggleTwoStep';

export default async function page() {
    const session = await auth()

    if (!session) {
      return <p>Not signed in</p>;
    }

  return (
    <div className='w-full flex flex-col items-center justify-center text-center mt-5'>
        {session && (
        <>
          <div className='mt-5 flex flex-col justify-center items-center'>
          {session.user?.image && <Image src={session.user?.image} width={120} height={120} alt={session.user?.name || "User Name"} className='rouded-full mb-4' draggable="false"/>}
          <p>{session.user?.role}</p>
          <p>{session.user?.email}</p>
          <p>{session.user?.name}</p>
          <p>{JSON.stringify(session.user)}</p>
          </div>


          {session.user?.id && <ToggleTwoStep userId={session.user.id} isTowStepEnabled={session.user.enabledTowStep}/>}
        </>
      )}
    </div>
  )
}
