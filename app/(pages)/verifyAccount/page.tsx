import { prisma } from "@/libs/prismadb";

interface verifyPageProps {
    searchParams : Promise<{token : string}>
}

const VerifyAccountPage = async ({searchParams} : verifyPageProps) => {
    const currentSearchParams = await searchParams;
    const {token} = currentSearchParams;

    const verifyToken = await prisma.verificationToken.findFirst({where: {token: token}})
    if(!verifyToken) return <div>Token not found</div>
    if(verifyToken.expires < new Date()) return <div>Token expired</div>
    await prisma.user.update({where: {email: verifyToken.email}, data: {emailVerified: new Date()}})
    return <div className="flex flex-col items-center justify-center my-10">Account Verified</div>
}

export default VerifyAccountPage