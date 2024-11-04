"use server";
import bcrypt from "bcrypt";
import * as z from "zod";
import { LoginSchema } from "@/schemas";

export const login = async (value: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(value);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  return { success: "email sent" };
};
