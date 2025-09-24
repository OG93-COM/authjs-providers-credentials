"use server";

import { signIn } from "../libs/auth";
import { prisma } from "../libs/prismadb";
import { LoginFormData, RegisterFormData, loginSchema, registerSchema, } from "../libs/validationSchema";
import * as bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "./generateToken";
import { sendVerificationToken } from "./mail";


// Login Action
export const loginAction = async (data: LoginFormData) => {

    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: "Probleme de connexion" };
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
export const registerAction = async (data: RegisterFormData) => {

    const validation = registerSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: "Votre compte n’a pas pu être créé. Veuillez réessayer plus tard." };
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
