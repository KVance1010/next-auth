"use server";
import { randomUUID } from "crypto";
import { getUserByEmail } from "@/actions/user";
import prisma from "@/lib/dbConnection";

export const generateVerificationToken = async (email: string) => {
  const token = randomUUID();
  // 1 hour token expiration
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      token,
      email,
      expires,
    },
  });
  return verificationToken;
};

export const verifyToken = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) return { error: "Token not found" };

  const hasExpired = new Date() > new Date(existingToken.expires);
  if (hasExpired) return { error: "Token has expired" };

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "Email not found" };

  await Promise.all([
    prisma.user.update({
      where: { email: existingToken.email },
      data: { emailVerified: new Date(), email: existingToken.email },
    }),
    prisma.verificationToken.delete({
      where: { id: existingToken.id },
    }),
  ]);
  return { success: "Email verified" };
};

const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });
    return verificationToken;
  } catch {
    return null;
  }
};

const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { email },
    });
    return verificationToken;
  } catch {
    return null;
  }
};



  