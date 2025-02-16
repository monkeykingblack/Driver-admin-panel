import React, { ReactElement } from 'react';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

import { ReactQueryKey } from '~/consts/react-api-keys';
import BookingPage from '~/features/dashboard/booking/booking-page';
import { DashboardLayout } from '~/layout';
import { ensureLogin, NextPageWithLayout } from '~/libs';

const BookingRoute: NextPageWithLayout = () => {
  return <BookingPage />;
};

export const getServerSideProps: GetServerSideProps = ensureLogin(async (context, axios) => {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.fetchQuery({
      queryKey: ReactQueryKey.bookingList({ page: 1, pageSize: 10 }),
      queryFn: () => axios.get('/booking').then(({ data }) => data),
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
