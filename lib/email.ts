import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const resendEmail = process.env.RESEND_EMAIL_ADDRESS || "onboarding@resend.dev";
const conformationLink = process.env.WEBSITE_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {
  console.log("resend", process.env.RESEND_EMAIL_ADDRESS);
  const confirmationLink = `${conformationLink}/auth/verification?token=${token}`;
  await resend.emails.send({
    from: resendEmail,
    to: email,
    subject: "Confirm your email",
    html: `<p>Please confirm your email to login. <a href=${confirmationLink}> click here </a> to confirm </P>`,
  });
};

export const sendNewPasswordEmail = async (email: string, token: string) => {
  const changePasswordLink = `${conformationLink}/auth/new-password?token=${token}`;
  await resend.emails.send({
    from: resendEmail,
    to: email,
    subject: "Forgot Password",
    html: `<p> <a href=${changePasswordLink}>click here </a> to change your password</P>`,
  });
};
