import React, { ReactElement } from 'react';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

import { ReactQueryKey } from '~/consts/react-api-keys';
import DriverDetailPage from '~/features/dashboard/driver/driver-detail-page';
import { DashboardLayout } from '~/layout';
import { ensureLogin, NextPageWithLayout } from '~/libs';

type Props = {};

const DriverDetailRoute: NextPageWithLayout<Props> = (props) => {
  return <DriverDetailPage {...props} />;
};

DriverDetailRoute.getLayout = function getLayout(page: ReactElement, pageProps) {
  return <DashboardLayout {...pageProps}>{page}</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = ensureLogin(async (context, axios) => {
  const queryClient = new QueryClient();
  const { driverId } = context.query;

  await Promise.all([
    queryClient.fetchQuery({
      queryKey: ReactQueryKey.driverDetail(driverId as string),
      queryFn: ({ queryKey }) => axios.get('/driver/' + queryKey[1]).then(({ data }) => data),
    }),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
});

export default DriverDetailRoute;
