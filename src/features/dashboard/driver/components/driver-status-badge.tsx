import React, { useMemo } from 'react';

import { Driver } from '@prisma/client';
import { capitalize } from 'lodash';

import { Badge, BadgeProps } from '~/components/ui/badge';

const DriverStatusBadge = ({ driver }: { driver: Driver }) => {
  const variant = useMemo<BadgeProps['variant']>(() => {
    switch (driver.status) {
      case 'APPROVED':
        return 'default';
      case 'BLOCK':
        return 'destructive';
      case 'PENDING':
        return 'secondary';
    }
  }, [driver.status]);

  return (
    <Badge variant={variant} className="py-1">
      {capitalize(driver.status)}
    </Badge>
  );
};

export default DriverStatusBadge;
