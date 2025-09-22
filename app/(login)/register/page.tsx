import RegisterForm from "@/app/components/RegisterForm"

export default function RegisterPage() {
    return (
        <>
      
        <div className="text-lg font-bold mt-28 fjcic mb-5 text-gray-600 lg:mx-20 block gap-2 tracking-tight">
          <h1 className='lg:text-xl md:text-xl text-lg w-fit text-nowrap bg-[#1488CC] py-2 px-4 rounded-md text-white uppercase'>Inscription</h1>
        </div>
        <div className="w-full flex justify-center items-center space-x-[-100px] mb-20">
             <RegisterForm />
        </div>
        
      </>
    )
  }
  