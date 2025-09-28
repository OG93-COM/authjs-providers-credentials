"use client"

interface PropsErrorPage {
    error : Error,
    reset : () => void
}


const ErrorPage = ( {error, reset} : PropsErrorPage) => {
  return (
    <div className="flex flex-col justify-center items-center m-4 gap-2">
        <h1>Something Went Wrong</h1>
        <p>{error.message}</p>
        <button
            className="bg-slate-700 text-white p-2 rounded-md hover:bg-slate-800 cursor-pointer"
            onClick={() => reset()}>Try Again
        </button>
    </div>
  )
}

export default ErrorPage