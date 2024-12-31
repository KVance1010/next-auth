"use server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/dbConnection";
import z from "zod";
import { RegistrationValidation } from "@/validation/schema";
import { getUserByEmail } from "@/actions/user";
import { generateVerificationToken } from "@/actions/auth/tokens";
import { sendVerificationEmail } from "@/lib/email";

export const register = async (
  value: z.infer<typeof RegistrationValidation>
) => {
  const validatedFields = RegistrationValidation.safeParse(value);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  const { email, password, username } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already exists" };
  }

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
    },
  });
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation Email Sent" };
};
