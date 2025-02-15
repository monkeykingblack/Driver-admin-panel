import type { NextAuthConfig } from 'next-auth';

import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import Credentials from 'next-auth/providers/credentials';
import * as v from 'valibot';

import { LoginSchema } from '~/schemas';

import { prisma } from '../server/prisma';

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as Adapter,
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  providers: [
    Credentials({
      credentials: {
        username: {
          type: 'text',
        },
        password: {
          type: 'password',
        },
      },
      async authorize(credentials) {
        try {
          const data = v.parse(LoginSchema, credentials);

          const user = await prisma.user.findUnique({
            where: {
              username: data.username,
            },
          });

          if (!user) {
            throw new Error('No user found');
          }

          const isPasswordValid = bcrypt.compareSync(data.password, user.hashedPassword);

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return { ...user };
        } catch (e) {
          console.log(e);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role!;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
