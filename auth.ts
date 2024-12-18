import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import sha256 from "crypto-js/sha256";
import prisma from "@/prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "@auth/core/providers/credentials";
import { Role } from "@prisma/client";

export async function hashPassword(password: string): Promise<string> {
  return sha256(password).toString();
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email or Phone",
        },
        password: {
          label: "Password",
        },
      },
      authorize: async (credentials: any) => {
        let user = null;
        const pwHash = await hashPassword(credentials.password);
        user = await prisma.user.findFirst({
          where: {
            AND: [
              {
                OR: [{ email: credentials.email }],
              },
              { password: pwHash },
            ],
          },
        });

        if (!user) {
          return null;
        }
        return user;
      },
    }),
    Google,
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: {
            id: user.id,
          },
        });
        token.role = dbUser?.role || Role.USER;
      }
      return token;
    },
    async session({ session }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: session.user.email!,
          },
        });
        // @ts-expect-error This is a valid assignment
        session.user.role = dbUser?.role || Role.USER;
        // @ts-expect-error This is a valid assignment
        session.user.id = dbUser?.id;
      }
      return session;
    },
  },
});
