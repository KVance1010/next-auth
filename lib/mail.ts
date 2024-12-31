import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const resendEmail = process.env.RESEND_EMAIL_ADDRESS;
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${process.env.CONFIRMATION_LINK}${token}`;
  await resend.emails.send({
    from: resendEmail,
    to: email,
    subject: "Verification:Authjs v5 demo project",
    html: `<p>welcome to my Auth v5 demo.please click <a href=${confirmationLink}>here </a> to confirm </P>`,
  });
};
export const sendNewPasswordEmail = async (email: string, token: string) => {
  const changePasswordLink = `${process.env.CONFIRMATION_LINK_TOKEN}${token}`;
  await resend.emails.send({
    from: resendEmail,
    to: email,
    subject: "Change password:Authjs v5 project",
    html: `<p>click <a href=${changePasswordLink}>here </a> to change the password</P>`,
  });
};
