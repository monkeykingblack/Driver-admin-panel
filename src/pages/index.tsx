import type { ReactElement } from 'react';

import { DashboardLayout } from '~/layout';
import { ensureLogin, NextPageWithLayout } from '~/libs';

type Props = {};

const Home: NextPageWithLayout<Props> = (props: Props) => {
  return <>Home</>;
};

Home.getLayout = function getLayout(page: ReactElement, pageProps: Props) {
  return <DashboardLayout {...pageProps}>{page}</DashboardLayout>;
};

export const getServerSideProps = ensureLogin(async () => ({
  props: {},
}));

export default Home;
