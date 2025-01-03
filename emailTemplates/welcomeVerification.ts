import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const resendEmail = process.env.RESEND_EMAIL_ADDRESS || "onboarding@resend.dev";
const conformationLink = process.env.WEBSITE_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${conformationLink}/verification?token=${token}`;
  await resend.emails.send({
    from: resendEmail,
    to: email,
    subject: "Confirm your email",
    html: `<p>Please confirm your email to login. <a href=${confirmationLink}> click here </a> to confirm </P>`,
  });
};

