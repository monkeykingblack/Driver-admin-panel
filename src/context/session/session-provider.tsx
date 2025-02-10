import type { User } from '@prisma/client';

import { useCallback, useMemo, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { merge } from 'lodash';

import { axios } from '~/libs';

import { ISessionContext, SessionContext } from './session-context';

interface ISessionProviderProps {
  user?: User;
  disabledApi?: boolean;
  fallback?: React.ReactNode;
}

const userMe = async () => axios<{ user: User }>('/api/user/me', { withCredentials: true });

export const SessionProvider: React.FC<React.PropsWithChildren<ISessionProviderProps>> = (props) => {
  const { user, fallback, children, disabledApi = false } = props;
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<{} | undefined>(() => {
    if (user) {
      return user;
    }
    return undefined;
  });

  const { data: userQuery } = useQuery({
    queryKey: ['user-me'],
    queryFn: () => userMe().then(({ data }) => data.user),
    enabled: !disabledApi,
  });
  const { mutateAsync: getUser } = useMutation({ mutationFn: userMe });

  const refresh = useCallback(async () => {
    const { data } = await getUser();
    queryClient.invalidateQueries({ queryKey: ['user-me'] });
    setCurrentUser(data);
    return data;
  }, [getUser, queryClient]);

  const value: ISessionContext = useMemo(
    () => ({
      user: merge({}, currentUser, userQuery),
      refresh,
    }),
    [currentUser, userQuery, refresh],
  );

  if (!value.user) {
    return <>{fallback}</>;
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};
