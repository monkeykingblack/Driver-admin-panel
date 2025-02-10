import type { User } from '@prisma/client';
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetServerSideProps as NextGetServerSideProps,
  PreviewData,
} from 'next';

import { ParsedUrlQuery } from 'querystring';

import { createAxios } from './axios';
import { HttpError } from './errors';

type GetServerSideProps<
  P extends { [key: string]: unknown } = { [key: string]: unknown },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
> = (context: GetServerSidePropsContext<Q, D>) => Promise<GetServerSidePropsResult<P>>;

export function ensureLogin<P extends { [key: string]: unknown }>(
  handler: GetServerSideProps<P, ParsedUrlQuery, PreviewData>,
  isLoginPage?: boolean,
): NextGetServerSideProps<P> {
  return async (context: GetServerSidePropsContext) => {
    let props: { [key: string]: unknown } = {};
    try {
      props['user'] = await createAxios()<{ user: User }>('/api/user/me', {
        headers: { cookie: context.req.headers.cookie },
      }).then(({ data }) => data.user);
      if (isLoginPage) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    } catch (e) {
      if (e instanceof HttpError) {
        if (isLoginPage) {
          return handler(context);
        } else {
          const redirect = encodeURIComponent(context.req?.url || '');
          const query = redirect ? `redirect=${redirect}` : '';
          return {
            redirect: {
              destination: `/auth/login?${query}`,
              permanent: false,
            },
          };
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      props['err'] = (e as any).message;
    }

    const res = await handler(context);

    if ('props' in res) {
      props = {
        ...(await res.props),
        ...props,
      };
    }

    return {
      ...res,
      props: props as P,
    };
  };
}
