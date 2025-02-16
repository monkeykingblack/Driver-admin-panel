import React, { useState } from 'react';

import { HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

import { createQueryClient } from '~/libs/query-client';

import { AppContext } from './app-context';

type Props = React.PropsWithChildren<{
  forcedTheme?: string;
  dehydratedState?: unknown;
  disableWs?: boolean;
}>;

export const AppProvider: React.FC<Props> = (props: Props) => {
  const { forcedTheme, dehydratedState, children } = props;
  const [queryClient] = useState(() => createQueryClient());

  return (
    <ThemeProvider attribute="class" forcedTheme={forcedTheme}>
      <AppContext.Provider value={{}}>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
        </QueryClientProvider>
      </AppContext.Provider>
    </ThemeProvider>
  );
};
