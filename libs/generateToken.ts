import {prisma} from "./prismadb";
import { randomUUID } from "crypto";

// Generate Token for User Registration
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
            expires: new Date( new Date().getTime() + 3600 * 1000 * 3),
            email
        }
    })

    return newVerificationToken
}

//  Generate Token for Forgot Password
export const generateResetPasswordToken = async (email : string) => {

    const resetPasswordToken = await prisma.verificationResetPasswordToken.findFirst({
        where: {email}
    })

    // Verified if token exist and delete old token for new user without verification
    if(resetPasswordToken) {
        await prisma.verificationResetPasswordToken.delete({
            where : {id : resetPasswordToken.id}
        })
    }

    // Create the verification token on database
    const newResetPasswordToken = await prisma.verificationResetPasswordToken.create({
        data : {
            token: randomUUID(),
            expires: new Date( new Date().getTime() + 3600 * 1000 * 3),
            email
        }
    })
    console.log(newResetPasswordToken)

    return newResetPasswordToken
}