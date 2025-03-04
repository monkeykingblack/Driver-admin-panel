'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/router';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

export function RouterProgressBar() {
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleStart = (...args: any[]) => {
      if (!args?.[1]?.shallow) {
        NProgress.start();
      }
    };
    const handleStop = () => NProgress.done();

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router.events]);

  return (
    <style>
      {`
        #nprogress .bar {
          height: 2px;
        }
     `}
    </style>
  );
}
