"use server";
import { randomUUID } from "crypto";
import { ResetValidation, ResetType } from "@/validation/schema";
import { getUserByEmail } from "@/actions/user";
import { sendPasswordResetEmail } from "@/email/passwordReset";
import prisma from "@/lib/dbConnection";

export const passwordReset = async (values: ResetType) => {
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

// const getResetTokenByToken = async (token: string) => {
//   try {
//     const resetToken = await prisma.passwordResetToken.findUnique({
//       where: {
//         token,
//       },
//     });
//     return resetToken;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

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
