import { z } from "zod";


export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: "L'email est obligatoire" })
    .email({ message: "Email invalide" }),
    password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(64, "Le mot de passe est trop long")
    .regex(/[A-Z]/, "Verifier votre mot de passe")
    .regex(/[a-z]/, "Verifier votre mot de passe")
    .regex(/[0-9]/, "Verifier votre mot de passe")
    .regex(/[^A-Za-z0-9]/, "Verifier votre mot de passe"),
})

    export const registerSchema = z.object({
        name: z.string()
          .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
          .max(50, { message: "Le nom est trop long" })
          .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: "Le nom contient des caractères non valides" }),
      
        email: z.string()
          .min(1, { message: "L'email est obligatoire" })
          .email({ message: "Email invalide" }),
      
        password: z.string()
          .min(8, "Le mot de passe doit contenir au moins 8 caractères")
          .max(64, "Le mot de passe est trop long")
          .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
          .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
          .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
          .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
      })
      .refine(
        (data) => data.password !== data.email,
        {
          message: "Le mot de passe ne doit pas être identique à l'email",
          path: ["password"],
        }
      )
      .refine(
        (data) => !["password123", "12345678", "azerty"].includes(data.password.toLowerCase()),
        {
          message: "Ce mot de passe est trop courant, choisissez-en un autre",
          path: ["password"],
        }
      );

      export const resetVerificationPasswordSchema = z.object({
        email: z.string()
        .min(1, { message: "L'email est obligatoire" })
        .regex(
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          { message: "Email invalide" }
        )
      })

      export const changePasswordSchema = z.object({
        newPassword: z.string()
          .min(8, "Le mot de passe doit contenir au moins 8 caractères")
          .max(64, "Le mot de passe est trop long")
          .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
          .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
          .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
          .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
      })
      .refine(
        (data) => !["password123", "12345678", "azerty"].includes(data.newPassword.toLowerCase()),
        {
          message: "Ce mot de passe est trop courant, choisissez-en un autre",
          path: ["password"],
        }
      );

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetVerificationPasswordData = z.infer<typeof resetVerificationPasswordSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
