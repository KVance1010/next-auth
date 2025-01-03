"use server";
import { LoginValidation, LoginType } from "@/validationSchemas/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/actions/auth/validation";
import { sendVerificationEmail } from "@/emailTemplates/welcomeVerification";
import { sendTwoFactorAuth } from "@/emailTemplates/twoFactor";
import { getUserByEmail } from "@/actions/user";
import {
  generateTwoFactorToken,
  getTwoFactorConformationById,
  getTwoFactorTokenByEmail,
} from "@/actions/auth/twoFactorAuth";
import prisma from "@/lib/dbConnection";

export const login = async (value: LoginType) => {
  const validatedFields = LoginValidation.safeParse(value);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, code } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid credentials" };
  }

  if (!existingUser.emailVerified) {
    const newToken = await generateVerificationToken(email);
    await sendVerificationEmail(newToken.email, newToken.token);
    return { error: "Please Verify Email" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: "Invalid two factor code" };
      }

      const hasExpired = new Date() > twoFactorToken.expires;
      if (hasExpired) {
        return { error: "Two factor code has expired" };
      }

      const [_deletedToken, existingConfirmation] = await Promise.all([
        prisma.twoFactorToken.delete({ where: { id: twoFactorToken.id } }),
        getTwoFactorConformationById(existingUser.id),
      ]);

      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await prisma.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
      
    } else {
      const twoFactorToken = await generateTwoFactorToken(email);
      await sendTwoFactorAuth(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    return { success: "Logged in successfully" };
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw err;
  }
};
