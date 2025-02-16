import { Role } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextRequest } from 'next/server';

import { auth } from '~/consts/next-auth';

import { NextResponseError } from './errors/next-response-error';

type WrapperOptions = {
  session?:
    | boolean
    | {
        canAccess: Role[];
      };
};

export function requestWrapper<
  T extends Record<string, string | string[] | undefined> = Record<string, undefined>,
  R = { params: Promise<T> },
>(handler: (req: NextRequest, ctx: R) => Promise<Response>, options: WrapperOptions = { session: true }) {
  return async (req: NextRequest, ctx: R) => {
    if (options.session) {
      const session = await auth();
      if (!session) {
        return NextResponseError.unAuthorized();
      }

      const { role } = session.user;

      if (Array.isArray(options.session) && options.session.length) {
        if (!options.session.includes(role)) {
          return NextResponseError.forbidden();
        }
      }
    }

    try {
      const res = await handler(req, ctx);
      return res;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          return NextResponseError.recordNotFound();
        }
        return NextResponseError.json(e.message, 500);
      }

      return NextResponseError.json('Server Internal error', 500);
    }
  };
}
