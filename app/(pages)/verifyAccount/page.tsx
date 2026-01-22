import { prisma } from "@/libs/prismadb";
import Link from "next/link";
import { redirect } from "next/navigation";

interface verifyPageProps {
    searchParams : Promise<{token : string}>
}

const VerifyAccountPage = async ({searchParams} : verifyPageProps) => {
    const currentSearchParams = await searchParams;
    const {token} = currentSearchParams;

    const verifyToken = await prisma.verificationToken.findFirst({where: {token}})
    if(!verifyToken) return <div className="flex flex-col items-center justify-center my-10"> <p>User not found</p></div>
    if(verifyToken.expires < new Date()) return <div>Lien d'Activation expiree</div>
    
    try {
      await prisma.user.update({where: {email: verifyToken.email}, data: {emailVerified: new Date()}})
      return <div className="flex flex-col items-center justify-center">
      <div className=" mt-10 p-2 rounded-md bg-green-200"> <p>Account Verified</p></div>
      <Link href={"/login"} className="p-2 my-2 text-sm font-bold bg-green-600 hover:bg-green-800 text-white rounded-md">Go to login page</Link>
      </div>

    } catch (error) {
      return <div className="flex flex-col items-center justify-center my-10 p-2 rounded-r-md bg-red-200"><p>Error verifying account</p></div>
    }

}

export default VerifyAccountPage