import * as z from "zod";

export const LoginSchema = z.object({
  password: z.string().min(1, {message: "Password is required"}),
  email: z.string().email({message: "Password is required"}),
});