import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const resendEmail = process.env.RESEND_EMAIL_ADDRESS || "onboarding@resend.dev";

export const sendTwoFactorAuth = async (email: string, token: string) => {
  await resend.emails.send({
    from: resendEmail,
    to: email,
    subject: "Two Factor Authentication Code",
    html: `<p>Your two factor authentication code is: ${token}</P>`,
  });
};
