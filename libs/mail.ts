import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationToken = async (email: string, token: string) => {

    const link = `${process.env.DOMAIN}/verifyAccount?token=${token}`

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
                    style="display: inline-block; margin-top: 20px; padding: 12px 25px; background-color: #4CAF50; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 5px; transition: background-color 0.3s;">
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