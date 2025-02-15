import React from 'react';

import { GetServerSideProps } from 'next';

import DriverCreatePage from '~/features/dashboard/driver/driver-create-page';
import { DashboardLayout } from '~/layout';
import { ensureLogin, NextPageWithLayout } from '~/libs';

type Props = {};

const DriverCreateRoute: NextPageWithLayout<Props> = (props) => {
  return <DriverCreatePage {...props} />;
};

export const getServerSideProps: GetServerSideProps = ensureLogin(async () => {
  return {
    props: {},
  };
});

DriverCreateRoute.getLayout = function getLayout(page, pageProps) {
  return <DashboardLayout {...pageProps}>{page}</DashboardLayout>;
};

export default DriverCreateRoute;
