import type { NextAuthOptions } from 'next-auth';

import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { Adapter } from 'next-auth/adapters';
import Credentials from 'next-auth/providers/credentials';
import * as v from 'valibot';

import { LoginSchema } from '~/schemas';

import { prisma } from '../server/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  pages: {
    signIn: '/auth/login',
  },
  debug: process.env.NODE_ENV === 'development',
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
    // async redirect() {
    //   return '';
    // },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
