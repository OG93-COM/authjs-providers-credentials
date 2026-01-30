"use server";

import { signIn } from "../auth";
import { prisma } from "../prismadb";
import { LoginFormData, RegisterFormData, loginSchema, registerSchema, } from "../validationSchema";
import * as bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { generateTwoStepToken, generateVerificationToken } from "../generateToken";
import { sendTwoStepToken, sendVerificationToken } from "../mail";
import { ActionTypes, LoginType } from "@/types/types";


// Login Action
export const loginAction = async (data: LoginFormData) : Promise<LoginType> => {

    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: validation.error.issues[0].message || "Probleme de connexion, Réessayer ultérieurement" };
    }

    const {email, password, code } = validation.data

    try {
        const user = await prisma.user.findUnique({
            where : {email}
        })
        if(!user || !user.email || !user.password) {
            return { success: false, message: "Probleme de connexion. Invalid Crendentials" };
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            return { success: false, message: "Mot de passe Incorrect 🤔" };
        }

        if(!user.emailVerified) {
            const verificationToken = await generateVerificationToken(email);
            await sendVerificationToken(verificationToken.email, verificationToken.token)
            return { success: true, message: "Un e-mail de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception." };
        }

        if(user.enabledTowStep && user.email) {
            if(code) {
                const twoStepTokenFromDb = await prisma.twoStepToken.findFirst({where : {email: user.email}})
                if(!twoStepTokenFromDb) {
                    return { success: false, message: "Token Introuvable 🤔" }
                }
                if(twoStepTokenFromDb.token !== code){
                    return { success: false, message: "Code est Invalide 🤷🏻" }
                }

                const isExpired = new Date(twoStepTokenFromDb.expires) < new Date()
                if(isExpired) {
                    return { success: false, message: "Votre code est expiré, Essayer une autre fois avec un nouveau code 🔄" }
                }
                await prisma.twoStepToken.delete({where : {id : twoStepTokenFromDb.id}})

                const twoStepConfirmation = await prisma.twoStepConfirmation.findUnique({where : {userId : user.id}})
                if(twoStepConfirmation){
                    await prisma.twoStepConfirmation.delete({where : {id : twoStepConfirmation.id}})
                }

                await prisma.twoStepConfirmation.create({
                    data : {userId: user.id}
                })

            } else {
                const twoStepToken = await generateTwoStepToken(user.email)
                await sendTwoStepToken(twoStepToken.email, twoStepToken.token)
                return { success: true, message: "Un Code de confirmation vous a été envoyé. Veuillez vérifier votre boîte Email 📩" }
            }
        }

        await signIn("credentials", {email, password, redirectTo:"/profile" })

    } catch (error) {
        if(error instanceof AuthError) {
            console.log("the XXXXXX error ", error)
            switch(error.type){
                case "CredentialsSignin" :
                    return { success: false, message: "Email ou Mot de pass invalide" }
                default:
                    return { success: false, message: "Probleme de connexion" }
            }
        }
        throw error
    }

    return { success: true, message: "Connected Successfully From server" };
};


// Register Action
export const registerAction = async (data: RegisterFormData) : Promise<ActionTypes> => {

    const validation = registerSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: validation.error.issues[0]?.message || "Votre compte n’a pas pu être créé. Veuillez réessayer plus tard." };
    }

    const {name, email, password} = validation.data

    try {

        const user = await prisma.user.findUnique({
            where:{email},
        })
    
        if(user) return { success: false, message: "Cet email est déjà associé à un compte." };
    
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password:hashedPassword,
            },
        });

        const verificationToken = await generateVerificationToken(email);
        await sendVerificationToken(verificationToken.email, verificationToken.token)

        return { success: true, message: "Un e-mail de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception." };

    } catch (err: any) {
        // console.log("❌ Error Register:", err);
        return { success: false, message: "Erreur lors de l'inscription. L'email existe déjà ?" };
    }
};

// Toggle TwoStep Action
export const toggleTwoStepAction = async (userId:string, isEnabled : boolean): Promise<ActionTypes> => {
    try {
        await prisma.user.update({
            where : {id : userId},
            data: {enabledTowStep: isEnabled}
        })
        return {success:true, message:`Changement du Vérification en deux étapes ${isEnabled ? "Activé" : "Désactivé"}`}
    } catch (error) {
        console.log(error)
        return {success:false, message:"Il y a un probleme lors de changement du Vérification en deux étapes"}
    }
}