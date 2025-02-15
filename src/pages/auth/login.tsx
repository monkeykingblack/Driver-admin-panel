import type { GetServerSideProps } from 'next';
import type { NextPageWithLayout } from '~/libs';

import React, { ReactElement, useState } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { getProviders } from 'next-auth/react';

import LoginPage from '~/features/auth/pages/login-page';
import { AuthLayout } from '~/layout';
import { ensureLogin } from '~/libs';
import { createQueryClient } from '~/libs/query-client';

type Props = {
  /** Defined props */
  provider: string;
};

const LoginRoute: NextPageWithLayout<Props> = (props: Props) => {
  const [queryClient] = useState(() => createQueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <LoginPage {...props} />
    </QueryClientProvider>
  );
};

LoginRoute.getLayout = function getLayout(page: ReactElement, pageProps: Props) {
  return <AuthLayout {...pageProps}>{page}</AuthLayout>;
};

export default LoginRoute;

export const getServerSideProps: GetServerSideProps<Props> = ensureLogin(async () => {
  const providers = await getProviders();

  return {
    props: { provider: providers?.credentials.id || '' },
  };
}, true);
