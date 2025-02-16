import React, { useCallback, useMemo, useState } from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '~/components/ui/button';
import { DataTable } from '~/components/ui/data-table';
import { Input } from '~/components/ui/input';
import { ReactQueryKey } from '~/consts/react-api-keys';
import { axios } from '~/libs';
import { IGetBookingQuery } from '~/schemas';

import { columns } from './components/column';

const BookingPage = () => {
  const router = useRouter();

  const [pageParams, setPageParams] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<string>();
  const params = useMemo<IGetBookingQuery>(
    () => ({
      search,
      page: pageParams.pageIndex + 1,
      pageSize: pageParams.pageSize,
    }),
    [pageParams.pageIndex, pageParams.pageSize, search],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearchChange = useCallback(
    debounce((value) => setSearch(value), 300),
    [],
  );

  const { data, isFetching } = useQuery({
    queryKey: ReactQueryKey.bookingList(params),
    queryFn: () => axios.get('/api/booking', { params }).then(({ data }) => data),
    placeholderData: keepPreviousData,
  });

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
            <Button size="sm" onClick={() => router.push('/booking/new')}>
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

export default BookingPage;
