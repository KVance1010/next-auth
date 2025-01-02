import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const resendEmail = process.env.RESEND_EMAIL_ADDRESS || "onboarding@resend.dev";
const conformationLink = process.env.WEBSITE_URL || "http://localhost:3000";

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const changePasswordLink = `${conformationLink}/new-password?token=${token}`;
  await resend.emails.send({
    from: resendEmail,
    to: email,
    subject: "Reset your password",
    html: `<p> <a href=${changePasswordLink}>click here </a> to reset your password</P>`,
  });
};
