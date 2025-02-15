import type { User } from '@prisma/client';
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetServerSideProps as NextGetServerSideProps,
  PreviewData,
} from 'next';

import { ParsedUrlQuery } from 'querystring';

import { Axios } from 'axios';

import { auth } from '~/consts/next-auth';

import { createAxios } from './axios';
import { HttpError } from './errors';

type GetServerSideProps<
  P extends { [key: string]: unknown } = { [key: string]: unknown },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
> = (context: GetServerSidePropsContext<Q, D>, axiosInstance: Axios) => Promise<GetServerSidePropsResult<P>>;

export function ensureLogin<P extends { [key: string]: unknown }>(
  handler: GetServerSideProps<P, ParsedUrlQuery, PreviewData>,
  isLoginPage?: boolean,
): NextGetServerSideProps<P> {
  return async (context: GetServerSidePropsContext) => {
    let props: { [key: string]: unknown } = {};
    const axios = createAxios({
      baseURL: `http://localhost:${process.env.PORT}/api`,
    });
    const session = await auth(context);
    try {
      if (!session) {
        throw new HttpError('Unauthorized', 404);
      }
      axios.defaults.headers['cookie'] = context.req.headers.cookie || '';
      props['user'] = await axios<{ user: User }>('/user/me').then(({ data }) => data);
      if (isLoginPage) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }

      const res = await handler(context, axios);

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
    } catch (e) {
      if (e instanceof HttpError) {
        if (isLoginPage) {
          return handler(context, axios);
        }
        if (e.status === 401) {
          const redirect = encodeURIComponent(context.req?.url || '');
          const query = redirect ? `redirect=${redirect}` : '';
          return {
            redirect: {
              destination: `/auth/login?${query}`,
              permanent: false,
            },
          };
        }

        if (e.status === 402) {
          return {
            redirect: {
              destination: '/402',
              permanent: false,
            },
          };
        }
        if (e.status === 403) {
          return {
            redirect: {
              destination: '/403',
              permanent: false,
            },
          };
        }

        if (e.status === 404) {
          return {
            notFound: true,
          };
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      props['err'] = (e as any).message;

      return {
        props: props as P,
      };
    }
  };
}
