import React, { useMemo, useState } from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { debounce, isEmpty } from 'lodash';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/router';

import { Button } from '~/components/ui/button';
import { DataTable } from '~/components/ui/data-table';
import { Input } from '~/components/ui/input';
import { ReactQueryKey } from '~/consts/react-api-keys';
import { axios } from '~/libs';
import { IGetDriverQuery } from '~/schemas';

import { columns } from './components/column';

const DriverPage = () => {
  const [pageParams, setPageParams] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<string>();
  const params = useMemo<IGetDriverQuery>(
    () => ({
      search,
      page: pageParams.pageIndex + 1,
      pageSize: pageParams.pageSize,
    }),
    [pageParams.pageIndex, pageParams.pageSize, search],
  );
  const { data, isFetching } = useQuery({
    queryKey: ReactQueryKey.driverList(params),
    queryFn: () => axios('/api/driver', { params }).then(({ data }) => data),
    placeholderData: keepPreviousData,
  });

  const router = useRouter();

  const onSearchChange = debounce((value: string) => {
    setSearch(isEmpty(value) ? undefined : value);
    setPageParams((old) => ({ ...old, page: 1 }));
  }, 500);

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-4 md:flex md:p-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              className="h-8 w-[150px] lg:w-[250px]"
              placeholder="Search"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div>
            <Button size="sm" onClick={() => router.push('/driver/new')}>
              <PlusIcon />
              New
            </Button>
          </div>
        </div>
        <DataTable
          data={data?.result ?? []}
          columns={columns}
          loading={isFetching}
          totalItems={data?._meta?.total}
          paginationState={{
            ...pageParams,
            onPageChange: (updateStateOrValue) => {
              setPageParams(updateStateOrValue);
            },
          }}
        />
      </div>
    </div>
  );
};

export default DriverPage;
