import {prisma} from "./prismadb";
import { randomUUID } from "crypto";

export const generateVerificationToken = async (email : string) => {

    const verificationToken = await prisma.verificationToken.findFirst({
        where: {email}
    })

    // Verified if token exist and delete old token for new user without verification
    if(verificationToken) {
        await prisma.verificationToken.delete({
            where : {id : verificationToken.id}
        })
    }

    // Create the verification token on database
    const newVerificationToken = await prisma.verificationToken.create({
        data : {
            token: randomUUID(),
            expires: new Date( new Date().getTime() + 3600 * 1000 * 2),
            email
        }
    })

    return newVerificationToken
}