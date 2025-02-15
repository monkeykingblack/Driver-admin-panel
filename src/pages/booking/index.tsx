import React, { ReactElement } from 'react';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

import { DashboardLayout } from '~/layout';
import { ensureLogin, NextPageWithLayout } from '~/libs';

const BookingRoute: NextPageWithLayout = () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = ensureLogin(async (context, axios) => {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.fetchQuery({
      queryKey: ['driver/lists'],
      queryFn: () => axios.get('/driver').then(({ data }) => data.data),
    }),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient, {}),
    },
  };
});

BookingRoute.getLayout = function getLayout(page: ReactElement, pageProps) {
  return <DashboardLayout {...pageProps}>{page}</DashboardLayout>;
};

export default BookingRoute;
