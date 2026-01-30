import { Resend } from 'resend';

// Send Verification Token
export const sendVerificationToken = async (email: string, token: string) => {
    const link = `${process.env.DOMAIN}/verifyAccount?token=${token}`
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'oucema03@gmail.com',
            subject: 'Verify Your Account',
            html: `
            <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-align: center;">
                
                <h2 style="color: #333333;">Welcome!</h2>

                <p style="font-size: 16px; color: #555555;">
                    Please verify your account by clicking the button below:
                </p>

                <a href="${link}" 
                    style="display: inline-block; margin-top: 20px; padding: 12px 25px; background-color: #035ab6; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 5px; transition: background-color 0.3s;">
                    Verify Account
                </a>

                <p style="margin-top: 30px; font-size: 12px; color: #999999;">
                    If you didn’t create an account, you can safely ignore this email.
                </p>

                </div>
            </div>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            return { error };
        }

        console.log('Email sent successfully:', data);
        return { data };
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }

}

// Send Reset Password Token
export const sendResetPasswordToken = async (email: string, token: string) => {
    const link = `${process.env.DOMAIN}/reset-password?token=${token}`
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'oucema03@gmail.com',
            subject: 'Reset Your Password',
            html: `
            <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-align: center;">
                
                <h2 style="color: #333333;">Welcome!</h2>

                <p style="font-size: 16px; color: #555555;">
                    Please reset your password by clicking the button below: ${email}
                </p>

                <a href="${link}"
                    style="display: inline-block; margin-top: 20px; padding: 12px 25px; background-color: #035ab6; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 5px; transition: background-color 0.3s;">
                    Reset Your Password
                </a>

                <p style="margin-top: 30px; font-size: 12px; color: #999999;">
                    If you didn’t reset your password, you can safely ignore this email.
                </p>

                </div>
            </div>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            return { error };
        }

        console.log('Email sent successfully:', data);
        return { data };
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }

}

// Send Two Step Token
export const sendTwoStepToken = async (email: string, token: string) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'oucema03@gmail.com',
            subject: 'Confirme votre connexion',
            html: `
            <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-align: center;">
                    <h2 style="color: #333333;">Bienvenue !</h2>

                    <p style="font-size: 16px; color: #555555;">
                        Veuillez utiliser le code de vérification ci-dessous pour réinitialiser votre mot de passe : ${email}
                    </p>

                    <div style="margin: 30px 0; padding: 20px; background-color: #f0f0f0; border-radius: 8px; display: inline-block;">
                        <p style="font-size: 14px; color: #666666; margin: 0 0 10px 0;">Votre code de vérification :</p>
                        <p style="font-size: 32px; font-weight: bold; color: #035ab6; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">
                            ${token}
                        </p>
                    </div>

                    <p style="font-size: 14px; color: #666666; margin-top: 20px;">
                        Ce code expirera dans 1 heure.
                    </p>

                    <p style="margin-top: 30px; font-size: 12px; color: #999999;">
                        Si vous n'avez pas connecter a vote compte, vous pouvez ignorer cet e-mail en toute sécurité.
                    </p>
                </div>
            </div>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            return { error };
        }

        console.log('Email sent successfully:', data);
        return { data };
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }

}