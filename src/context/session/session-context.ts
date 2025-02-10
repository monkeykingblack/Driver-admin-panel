import type { User } from '@prisma/client';

import React from 'react';

export type ISession = {
  user?: User;
};

export type ISessionContext = ISession & {
  refresh: () => void;
};

export const SessionContext = React.createContext<ISessionContext>(null!);
