import React, { ReactElement } from 'react';

import BookingCreatePage from '~/features/dashboard/booking/booking-create-page';
import { DashboardLayout } from '~/layout';
import { ensureLogin, NextPageWithLayout } from '~/libs';

const CreateNewBookingRoute: NextPageWithLayout = () => {
  return <BookingCreatePage />;
};

export const getServerSideProps = ensureLogin(async () => {
  return {
    props: {},
  };
});

CreateNewBookingRoute.getLayout = function getLayout(page: ReactElement, pageProps) {
  return <DashboardLayout {...pageProps}>{page}</DashboardLayout>;
};

export default CreateNewBookingRoute;
