import React, { ReactElement } from 'react';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

import { ReactQueryKey } from '~/consts/react-api-keys';
import DriverPage from '~/features/dashboard/driver/driver-page';
import { DashboardLayout } from '~/layout';
import { ensureLogin, NextPageWithLayout } from '~/libs';

const DriverRoute: NextPageWithLayout = () => {
  return <DriverPage />;
};

export const getServerSideProps: GetServerSideProps = ensureLogin(async (context, axios) => {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.fetchQuery({
      queryKey: ReactQueryKey.driverList({ page: 1, pageSize: 10 }),
      queryFn: () => axios.get('/driver').then(({ data }) => data),
    }),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
});

DriverRoute.getLayout = function getLayout(page: ReactElement, pageProps) {
  return <DashboardLayout {...pageProps}>{page}</DashboardLayout>;
};

export default DriverRoute;
