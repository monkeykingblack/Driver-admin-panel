import React, { useState } from 'react';

import { HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

import { createQueryClient } from '~/libs/query-client';

import { ConnectionProvider } from '../connection/connection-provider';
import { AppContext } from './app-context';

type Props = React.PropsWithChildren<{
  forcedTheme?: string;
  wsPath?: string;
  dehydratedState?: unknown;
  disableWs?: boolean;
}>;

export const AppProvider: React.FC<Props> = (props: Props) => {
  const { forcedTheme, wsPath, dehydratedState, disableWs, children } = props;
  const [queryClient] = useState(() => createQueryClient());

  if (disableWs) {
    <ThemeProvider attribute="class" forcedTheme={forcedTheme}>
      <AppContext.Provider value={{}}>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
        </QueryClientProvider>
      </AppContext.Provider>
    </ThemeProvider>;
  }

  return (
    <ThemeProvider attribute="class" forcedTheme={forcedTheme}>
      <AppContext.Provider value={{}}>
        <ConnectionProvider wsPath={wsPath}>
          <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
          </QueryClientProvider>
        </ConnectionProvider>
      </AppContext.Provider>
    </ThemeProvider>
  );
};
