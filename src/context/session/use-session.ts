import { useContext, useMemo } from 'react';

import { SessionContext } from './session-context';

export const useSession = () => {
  const { user, refresh } = useContext(SessionContext);
  return useMemo(() => ({ user: user!, refresh }), [user, refresh]);
};
