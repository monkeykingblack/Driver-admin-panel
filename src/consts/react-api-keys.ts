import { IGetDriverQuery } from '~/schemas';

export const ReactQueryKey = {
  userMe: () => ['user/me'] as const,
  driverList: (query?: IGetDriverQuery) => (query ? ['driver/list', query] : (['driver/list'] as const)),
  driverDetail: (id: string) => ['driver', id] as const,
} as const;
