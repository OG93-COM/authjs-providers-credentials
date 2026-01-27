"use server"

import { ActionTypes } from "@/types/types";
import { generateResetPasswordToken } from "../generateToken";
import { sendResetPasswordToken } from "../mail";
import { prisma } from "../prismadb";
import { ChangePasswordData, changePasswordSchema, ResetVerificationPasswordData, resetVerificationPasswordSchema } from "../validationSchema";
import * as bcrypt from "bcrypt";

// Reset Password Action
export const resetPasswordAction = async (data: ResetVerificationPasswordData) : Promise<ActionTypes> => {

    const validation = resetVerificationPasswordSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: validation.error.issues[0]?.message || "Probleme de connexion" };
    }

    const {email } = validation.data

    const user = await prisma.user.findUnique({where : {email}})
    if(!user) return { success: false, message: "Utilisateur non trouvè." };

    try {
        // Generate and send reset password token for verified users
        const resetToken = await generateResetPasswordToken(email);
        await sendResetPasswordToken(resetToken.email, resetToken.token);

        return { success: true, message: "Un email de réinitialisation vous a été envoyé. Veuillez vérifier votre boîte de réception." };


    } catch (error) {
        console.log(error)
        return { success: false, message: "Une erreur s'est produite. Veuillez réessayer." };
    }
};

// Change Password Action
export const changePasswordAction = async (data: ChangePasswordData, token:string) : Promise<ActionTypes> => {

    const validation = changePasswordSchema.safeParse(data);
    console.log( )
    if (!validation.success) {
        return { success: false, message: validation.error.issues[0]?.message || "Probleme avec le nouveau mot de passe" };
    }

    const { newPassword } = validation.data

    try {

        const resetPasswordToken = await prisma.verificationResetPasswordToken.findUnique({where : {token}})
        if(!resetPasswordToken) return { success: false, message: "Token non trouvè." };

        const isExpired = new Date(resetPasswordToken.expires) < new Date()
        if(isExpired) return { success: false, message: "Token Expirè, Essayer une autre fois avec un nouveau code." };

        const user = await prisma.user.findUnique({where : {email: resetPasswordToken.email}})
        if(!user) return { success: false, message: "Utilisateur non trouvè." };if(!resetPasswordToken) return { success: false, message: "Token non trouvè." };


        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: {email: resetPasswordToken.email},
            data: {password: hashedPassword}
        })

        await prisma.verificationResetPasswordToken.delete({where: {id: resetPasswordToken.id}})

        return { success: true, message: "Votre Mot de passe a ete modifier avec success. Essayer de connecter avec le Nouveau Mot de passe" };


    } catch (error) {
        console.log(error)
        return { success: false, message: "Une erreur s'est produite lors de modification du mot de passe." };
    }
};