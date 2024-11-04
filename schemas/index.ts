import * as z from "zod";

export const LoginSchema = z.object({
  password: z.string().min(1, { message: "Password is required" }),
  email: z.string().email({ message: "Password is required" }),
});

export const RegisterSchema = z.object({
  password: z.string().min(6, { message: "Minimum 6 characters" }),
  email: z.string().email({ message: "Password is required" }),
  name: z.string().min(1, { message: "Name is required" }),
});
