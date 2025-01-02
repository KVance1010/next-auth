import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/dbConnection";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { LoginValidation } from "@/validationSchemas/schemas";
import { getUserById, getUserByEmail } from "@/actions/user";
import { Adapter } from "next-auth/adapters";
import { randomUUID } from "crypto";

declare module "next-auth" {
  interface Session {
    user: {
      role: "ADMIN" | "USER";
    } & DefaultSession["user"];
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // allow OAuth provider to sign in without email verification
      if (account?.provider !== "credentials") return true;
      // check if user exists
      if (!user?.id) return false;
      const existingUser = await getUserById(user.id);
      // if the user email is not verified, return
      if (!existingUser?.emailVerified) return false;

      // add 2fa check here
      return true;
    },
    async jwt({ account, user, token }) {
      if (account?.provider === "credentials") {
        const sessionToken = randomUUID();
        const expires = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000);

        const session = await PrismaAdapter(prisma).createSession!({
          userId: user.id!,
          sessionToken,
          expires,
        });
        token.sessionId = session.sessionToken;
      }
      return token;
    },
    session({ session }) {
      if (!session.user) return session;
      const user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        emailVerified: session.user.emailVerified,
        image: session.user.image,
        role: session.user.role,
      };
      session.user = user;
      return session;
    },
  },
  jwt: {
    async encode({ token }) {
      return token?.sessionId as unknown as string;
    },
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginValidation.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;
          const isValid = await bcrypt.compare(password, user.password);
          if (isValid) return user;
        }
        return null;
      },
    }),
  ],
});
