import React from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { ReactQueryKey } from '~/consts/react-api-keys';
import { axios } from '~/libs';
import { ICreateDriver } from '~/schemas';

import DriverForm from './components/driver-form';

type Props = {};

const DriverCreatePage = ({}: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync: createDriver } = useMutation({
    mutationFn: (data: ICreateDriver) => axios.post('/api/driver', data).then(({ data }) => data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ReactQueryKey.driverList });
      router.push({
        pathname: '/driver',
      });
    },
  });

  return (
    <div className="flex-1 lg:max-w-2xl">
      <DriverForm onSubmit={createDriver} />
    </div>
  );
};

export default DriverCreatePage;
