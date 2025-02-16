import React, { useMemo } from 'react';

import { RideBooking, RideStatus } from '@prisma/client';
import { Row } from '@tanstack/react-table';
import { capitalize } from 'lodash';

import { Badge, BadgeProps } from '~/components/ui/badge';

const BookingStatusBadge = ({ row }: { row: Row<RideBooking> }) => {
  const booking = row.original;
  const badgeProps = useMemo<BadgeProps>(() => {
    switch (booking.status) {
      case RideStatus.CANCELED:
        return {
          variant: 'destructive',
        };
      case RideStatus.COMPLETED:
        return {
          variant: 'default',
        };
      case RideStatus.PENDING:
        return {
          variant: 'outline',
        };
      case RideStatus.IN_PROGRESS:
        return {
          variant: 'secondary',
        };
    }
  }, [booking.status]);

  return <Badge {...badgeProps}>{capitalize(booking.status)}</Badge>;
};

export default BookingStatusBadge;
