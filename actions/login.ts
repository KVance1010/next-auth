"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";

export const login = async (value: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(value);
  if (!validatedFields.success) {
    // throw new Error("Invalid fields");
    return {error: "Invalid fields"};
  }
  return { success: "email sent" };
};
