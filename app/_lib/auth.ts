import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { createUser, getUser } from "./data-service";

const config: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const existingUser = await getUser(user.email);

      if (!existingUser) {
        await createUser({
          name: user.name,
          email: user.email,
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await getUser(user.email);
        token.userId = dbUser?.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
      }

      return session;
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);
