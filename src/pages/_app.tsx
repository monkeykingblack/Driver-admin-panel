import '~/styles/globals.css';

import type { AppProps as NextAppProps } from 'next/app';
import type { NextPageWithLayout } from '~/libs/types';

import Head from 'next/head';

import { RouterProgressBar } from '~/components/router-progress';
import { Toaster } from '~/components/ui/sonner';

type AppProps<T> = NextAppProps<T> & {
  /** Will be defined only is there was an error */
  err?: Error;
};

type AppPropsWithLayout = AppProps<{ err?: Error }> & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps: { ...pageProps } }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width,viewport-fit=cover, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      {getLayout(<Component {...pageProps} />, { ...pageProps })}
      <Toaster position="top-right" />
      <RouterProgressBar />
    </>
  );
}
