import {prisma} from "./prismadb";
import { randomInt, randomUUID } from "crypto";

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
        // Verified if token exist and delete old token
    if(resetPasswordToken) {
        await prisma.verificationResetPasswordToken.delete({
            where : {id : resetPasswordToken.id}
        })
    }
        // Create the reset token on database
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

//  Generate Token for twosteptoken
export const generateTwoStepToken = async (email : string) => {

    const twoStepToken = await prisma.twoStepToken.findFirst({
        where: {email}
    })
        // Verified if token exist and delete old token
    if(twoStepToken) {
        await prisma.verificationResetPasswordToken.delete({
            where : {id : twoStepToken.id}
        })
    }
        // Create the new twostep token on database
    const newTwoStepToken = await prisma.twoStepToken.create({
        data : {
            token: randomInt(100000, 999999).toString(),
            expires: new Date( new Date().getTime() + 3600 * 1000 * 3),
            email
        }
    })
    return newTwoStepToken
}