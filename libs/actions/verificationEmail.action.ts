"use server"
import { ActionTypes } from "@/types/types";
import { prisma } from "../prismadb"

export const verifyingEmailAction = async (token:string) : Promise<ActionTypes> => {
    try {
        const verificationToken = await prisma.verificationToken.findUnique({where : {token}});
        if(!verificationToken) {
            return {success:false, message: "Token not found"}
        }

        const isExpired = new Date(verificationToken.expires) < new Date

        if (isExpired) {
            return {success:false, message: "Token is expired"}
        }
        const user = await prisma.user.findUnique({where : {email: verificationToken.email}})
        if(!user) {
            return {success:false, message: "User notfound"}
        }

        await prisma.user.update({
            where: {id: user.id},
            data: {emailVerified: new Date()}
        })

        await prisma.verificationToken.delete({where: {token}})

        return {success:true, message: "Your Email Address Was Successfuly Verified ✅"}

    } catch (error) {
        return {success:false, message: "Something went wrong on verification"}
    }
}