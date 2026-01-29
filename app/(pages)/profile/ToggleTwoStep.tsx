"use client"

import { toggleTwoStepAction } from '@/libs/actions/auth.action';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ToggleTwoStepProps {
    userId : string,
    isTowStepEnabled : boolean
}

const ToggleTwoStep = ({userId, isTowStepEnabled}: ToggleTwoStepProps) => {

    const [isEnabled, setIsEnabled]=useState(isTowStepEnabled)
    const router = useRouter()

    const handleSubmitTwoStep = (e : React.FormEvent) => {
        e.preventDefault();
        toggleTwoStepAction(userId, isEnabled)
        .then(()=> toast.success(`Vérification en deux étapes ${isEnabled ? "Activé" : "Désactivé"}`))
        .then(()=> router.refresh())
    }

  return (
        <form onSubmit={handleSubmitTwoStep}>
            <div className='mt-5 w-fit flex flex-col items-center gap-4 border-2 p-4 rounded-md border-slate-200'>
                {/* Checkbox */}
                <label className='flex items-center gap-2 cursor-pointer'>
                <input type='checkbox'
                    checked={isEnabled}
                    onChange={(e)=> setIsEnabled(e.target.checked)}
                    className='w-4 h-4 rounded accent-slate-600 cursor-pointer'/>
                <span className='text-sm text-gray-700'>Vérification en deux étapes</span>
                </label>

                {/* Save Button */}
                {isEnabled !== isTowStepEnabled && <button type='submit'
                    className='px-6 py-2 bg-slate-600 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors cursor-pointer'>
                    Enregistrer
                </button>}
            </div>
        </form>
  )
}

export default ToggleTwoStep