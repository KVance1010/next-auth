"use server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/dbConnection";
import * as z from "zod";
import { RegisterValidation } from "@/validation/schema";
import { getUserByEmail } from "@/actions/user";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const register = async (value: z.infer<typeof RegisterValidation>) => {
  const validatedFields = RegisterValidation.safeParse(value);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already exists" };
  }

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
  
  await signIn("credentials", {
    email,
    password,
    redirectTo: DEFAULT_LOGIN_REDIRECT,
  });
  // send email verification
  return { success: "signup successful" };
};
