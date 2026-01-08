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
            <p>Congrats on sending your <strong>first email</strong>!</p>
            <div>
                <a href="${link}">Click Here to verify your account</a>
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