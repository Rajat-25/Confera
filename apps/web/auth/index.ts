import NextAuth, { NextAuthConfig, type NextAuthResult } from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { dbClient } from '@repo/db';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string | null; 
    };
  }
}

const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(dbClient),
  providers: [Google({})],
  session: {
    strategy: 'database',
    maxAge: 60 * 60 * 1
  },
  callbacks: {
    async session({ session, user }) {
      const dbUser = await dbClient.user.findUnique({
        where: { email: user.email! },
      });

      session.user.phone = dbUser?.phone ?? null;
      return session;
    },
  },
};

const result = NextAuth(authOptions);

export const handlers: NextAuthResult['handlers'] = result.handlers;
export const auth: NextAuthResult['auth'] = result.auth;
export const signIn: NextAuthResult['signIn'] = result.signIn;
export const signOut: NextAuthResult['signOut'] = result.signOut;
