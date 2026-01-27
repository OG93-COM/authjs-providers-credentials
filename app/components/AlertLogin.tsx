import { CheckCircle, WarningCircle } from "phosphor-react";

interface alertProps{
    type:"success"| "error";
    message: string;
}
export default function AlertLogin({type, message} : alertProps) {
    const setColors = () => {
        if(type === 'error')  return "bg-red-100 text-red-900 border-red-200";
        return "bg-green-100 text-green-900 border-green-200 animate-pulse";
    }
  return (
    <div className={`rouded-md text-sm flex gap-2 items-center my-1 border p-2 ${setColors()}`}>
        {type === "error" ? <WarningCircle/> : <CheckCircle/>}
        {message}
    </div>
  )
}
