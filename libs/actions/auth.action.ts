"use server";

import { signIn } from "../auth";
import { prisma } from "../prismadb";
import { LoginFormData, RegisterFormData, loginSchema, registerSchema, } from "../validationSchema";
import * as bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "../generateToken";
import { sendVerificationToken } from "../mail";
import { ActionTypes } from "@/types/types";


// Login Action
export const loginAction = async (data: LoginFormData) : Promise<ActionTypes> => {

    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: validation.error.issues[0].message || "Probleme de connexion, Réessayer ultérieurement" };
    }

    const {email, password } = validation.data

    try {

        const user = await prisma.user.findUnique({
            where : {email}
        })
        if(!user || !user.email || !user.password) {
            return { success: false, message: "Probleme de connexion. Invalid Crendentials" };
        }

        if(!user.emailVerified) {
            const verificationToken = await generateVerificationToken(email);
            await sendVerificationToken(verificationToken.email, verificationToken.token)
            return { success: true, message: "Un e-mail de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception." };
        }

        await signIn("credentials", {email, password, redirectTo:"/profile" })

    } catch (error) {
        if(error instanceof AuthError) {
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