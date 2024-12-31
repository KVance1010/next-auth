"use server";
import * as z from "zod";
import { LoginValidation } from "@/validation/schema";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/actions/auth/tokens";
import { sendVerificationEmail } from "@/lib/email";
import { getUserByEmail } from "@/actions/user";

export const login = async (value: z.infer<typeof LoginValidation>) => {
  const validatedFields = LoginValidation.safeParse(value);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid credentials" };
  }
  if (!existingUser.emailVerified) {
    const newToken = await generateVerificationToken(email);
    await sendVerificationEmail(newToken.email, newToken.token);
    return { error: "Email not verified" };
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
