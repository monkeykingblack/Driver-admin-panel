import type { Connection } from 'sharedb/lib/client';

import React from 'react';

export const ConnectionContext = React.createContext<{
  connection?: Connection;
  connected: boolean;
}>(null!);
