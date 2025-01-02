"use server";
import { randomUUID } from "crypto";
import {
  ResetValidation,
  ResetType,
  NewPasswordValidation,
  NewPasswordType,
} from "@/validationSchemas/schemas";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/actions/user";
import { sendPasswordResetEmail } from "@/emailTemplates/passwordReset";
import prisma from "@/lib/dbConnection";

export const passwordResetRequest = async (values: ResetType) => {
  try {
    const validateEmail = ResetValidation.safeParse(values);
    if (!validateEmail.success) {
      return { error: "Invalid email!" };
    }
    const { email } = validateEmail.data;
    const user = await getUserByEmail(email);
    if (!user) {
      return { error: "User not found!" };
    }
    const resetToken = await generateResetToken(email);
    await sendPasswordResetEmail(resetToken.email, resetToken.token);
    return { success: "Password reset link sent to your email!" };
  } catch (error) {
    console.log(error);
    return { error: "something went wrong!" };
  }
};

export const passwordReset = async (
  values: NewPasswordType,
  token?: string | null
) => {
  if (!token) {
    return { error: "Invalid token!" };
  }
  const validatedFields = NewPasswordValidation.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { password } = validatedFields.data;
  const existingToken = await getResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Invalid token!" };
  }
  if (existingToken.expires < new Date()) {
    return { error: "Token has expired!" };
  }
  const user = await getUserByEmail(existingToken.email);
  if (!user) {
    return { error: "User not found!" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await Promise.all([
    prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    }),
  ]);
  return { success: "Password reset successful!" };
};

const generateResetToken = async (email: string) => {
  const token = randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getResetTokenByEmail(email);
  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const resetToken = await prisma.passwordResetToken.create({
    data: {
      token,
      email,
      expires,
    },
  });
  return resetToken;
};

const getResetTokenByToken = async (token: string) => {
  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        token,
      },
    });
    return resetToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getResetTokenByEmail = async (email: string) => {
  try {
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        email,
      },
    });
    return resetToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};
