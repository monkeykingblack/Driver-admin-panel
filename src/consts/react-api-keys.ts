import { IGetBookingQuery, IGetDriverQuery } from '~/schemas';

export const ReactQueryKey = {
  userMe: () => ['user/me'] as const,
  driverList: (query?: IGetDriverQuery) =>
    query ? (['driver/list', query] as const) : (['driver/list'] as const),
  driverDetail: (id: string) => ['driver', id] as const,
  bookingList: (query?: IGetBookingQuery) =>
    query ? (['driver/booking', query] as const) : (['driver/booking'] as const),
  bookingDetail: (id: string) => ['booking', id] as const,
} as const;
