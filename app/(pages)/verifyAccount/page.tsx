import { prisma } from "@/libs/prismadb";
import { CheckCircle } from "phosphor-react";

interface verifyPageProps {
    searchParams : Promise<{token : string}>
}

const VerifyAccountPage = async ({searchParams} : verifyPageProps) => {
    const currentSearchParams = await searchParams;
    const {token} = currentSearchParams;

    const verifyToken = await prisma.verificationToken.findFirst({where: {token: token}})
    if(!verifyToken) return <div>Token not found</div>
    if(verifyToken.expires < new Date()) return <div>Token expired</div>
    
    try {
      await prisma.user.update({where: {email: verifyToken.email}, data: {emailVerified: new Date()}})
      return <div className="flex flex-col items-center justify-center my-10"><CheckCircle size={20} /> <p>Account Verified</p></div>
    } catch (error) {
      return <div>Error verifying account</div>
    }
}

export default VerifyAccountPage