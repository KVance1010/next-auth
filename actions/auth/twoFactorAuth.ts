"use server";
import prisma from "@/lib/dbConnection";
import { randomInt } from "crypto";

export const generateTwoFactorToken = async (email: string) => {
  const token = randomInt(100_000, 1_000_000).toString();
  // 15 min token expiration
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await prisma.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  const twoFactorToken = await prisma.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return twoFactorToken;
};

export const getTwoFactorConformationById = async (userId: string) => {
  try {
    const twoFactorConformation = await prisma.twoFactorConfirmation.findUnique(
      {
        where: {
          userId,
        },
      }
    );
    return twoFactorConformation;
  } catch {
    return null;
  }
};

const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findUnique({
      where: {
        token,
      },
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findFirst({
      where: {
        email,
      },
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};
