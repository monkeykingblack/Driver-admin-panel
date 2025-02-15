import React, { useState } from 'react';

import { Driver, Vehicle } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { ReactQueryKey } from '~/consts/react-api-keys';
import { axios } from '~/libs';
import { ICreateDriver } from '~/schemas';

import DriverForm from './components/driver-form';
import DriverInformation from './components/driver-information';
import VehicleInformation from './components/vehicle-information';

type Props = {};

const DriverDetailPage = ({}: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEdit, setIsEdit] = useState(false);

  const { driverId } = router.query;

  const { data, refetch } = useQuery({
    queryKey: ReactQueryKey.driverDetail(driverId as string),
    queryFn: () =>
      axios.get<Driver & { vehicle: Vehicle }>('/api/driver/' + driverId).then(({ data }) => data),
  });

  const { mutateAsync: updateDriver } = useMutation({
    mutationFn: (data: ICreateDriver) => axios.put('/api/driver/' + driverId, data).then(({ data }) => data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ReactQueryKey.driverDetail(driverId as string) });
      await refetch();
      setIsEdit(false);
    },
  });

  if (isEdit) {
    return (
      <div className="flex-1 lg:max-w-2xl">
        <DriverForm onSubmit={updateDriver} />
      </div>
    );
  }

  if (!data) {
    return <div>No driver found</div>;
  }

  return (
    <div className="flex-1 lg:max-w-2xl">
      <DriverInformation driver={data} />
      <VehicleInformation vehicle={data.vehicle} />
    </div>
  );
};

export default DriverDetailPage;
