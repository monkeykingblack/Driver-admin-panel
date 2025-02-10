import type { ReactNode } from 'react';

import { useMemo } from 'react';

import { useConnection } from '~/hooks';

import { ConnectionContext } from './connection-context';

interface IConnectionProviderProps {
  wsPath?: string;
  children: ReactNode;
}

export const ConnectionProvider = ({ children, wsPath }: IConnectionProviderProps) => {
  const { connected, connection } = useConnection(wsPath);

  const value = useMemo(() => {
    return { connection, connected };
  }, [connection, connected]);

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
};
