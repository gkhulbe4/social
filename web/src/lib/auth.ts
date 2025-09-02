import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import { redis } from "./redis";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // async session({ session, token }) {
    //   console.log(session);
    //   if (session.user) {
    //     session.user["id"] = token.id;
    //   }
    //   return session;
    // },
  },
  events: {
    async createUser(message) {
      console.log("User created", message.user.email);
      await redis.lpush(
        "emailQueue",
        JSON.stringify({ email: message.user.email, name: message.user.name })
      );
    },
  },
} satisfies NextAuthOptions;

export default authOptions;
