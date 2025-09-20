"use server";

import { signIn } from "../libs/auth";
import { prisma } from "../libs/prismadb";
import { LoginFormData, RegisterFormData, loginSchema, registerSchema, } from "../libs/validationSchema";
import * as bcrypt from "bcrypt";
import { AuthError } from "next-auth";


// Login Action
export const loginAction = async (data: LoginFormData) => {

    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: "Probleme de connexion" };
    }

    const {email, password } = validation.data

    try {
        await signIn("credentials", {email, password, redirectTo:"/" })
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

    console.log(data);
    return { success: true, message: "Connected Successfully From server" };
};


// Register Action
export const registerAction = async (data: RegisterFormData) => {

    const validation = registerSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: "Votre compte n’a pas pu être créé. Veuillez réessayer plus tard." };
    }

    const {name, email, password} = validation.data
    
    const user = await prisma.user.findUnique({
        where:{email},
    })

    if(user) return { success: false, message: "Cet email est déjà associé à un compte." };

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password:hashedPassword,
        },
        });

        console.log("✅ New User Created:", newUser);
        return { success: true, message: "Compte Creer avec succee" };
    } catch (err: any) {
        // console.log("❌ Error Register:", err);
        return { success: false, message: "Erreur lors de l'inscription. L'email existe déjà ?" };
    }
};
