"use server";
import { randomUUID } from "crypto";
import prisma from "@/lib/dbConnection";
import { getVerificationTokenByEmail} from "@/actions/auth/verficiation-token";

export const generateVerificationToken = async (email: string) => {
  const token = randomUUID();
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


