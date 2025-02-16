import React from 'react';

import { Driver } from '@prisma/client';

import { Descriptions } from '~/components/descriptions';

const RideBookingInformation = ({
  driver,
}: {
  driver: Driver & {
    _count: {
      rides: number;
    };
  };
}) => {
  return (
    <Descriptions
      title="Rides"
      description="Rides summary"
      items={[
        {
          key: 'rides',
          label: 'Completed rides',
          children: driver._count.rides,
        },
        {
          key: 'review',
          label: 'Review',
          children: driver.review || 'Not reviewed yet',
        },
      ]}
    ></Descriptions>
  );
};

export default RideBookingInformation;
