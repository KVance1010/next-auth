"use server";
import prisma from "@/lib/dbConnection";
import { getVerificationTokenByToken } from "@/actions/auth/token";
import { getUserByEmail } from "@/actions/user";

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
