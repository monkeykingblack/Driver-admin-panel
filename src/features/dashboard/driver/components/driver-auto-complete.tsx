import React, { useCallback, useMemo, useState } from 'react';

import { Driver } from '@prisma/client';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { AutoComplete, AutocompleteProps } from '~/components/ui/auto-complete';
import { axios } from '~/libs';
import { IGetDriverQuery } from '~/schemas';

const DriverAutoComplete = ({ onValueChange }: { onValueChange: AutocompleteProps['onValueChange'] }) => {
  const [params, setParams] = useState<IGetDriverQuery>({
    page: 1,
    pageSize: 10,
  });

  const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['driver/infiniteList'],
    queryFn: ({ pageParam }) =>
      axios
        .get<{
          result: Driver[];
          _meta: { page: number; pageSize: number; total: number };
        }>('/api/driver', {
          params: {
            ...params,
            page: pageParam,
          },
        })
        .then(({ data }) => data),
    initialPageParam: 1,
    getNextPageParam({ _meta }) {
      const hasMoreItems = _meta.page * _meta.pageSize < _meta.total;
      return hasMoreItems ? _meta.page + 1 : null;
    },
    placeholderData: keepPreviousData,
  });

  const onSearch = useCallback((value: string) => {
    setParams((oldValue) => ({
      ...oldValue,
      page: 1,
      search: value,
    }));
  }, []);

  const allOptions = useMemo(
    () => (data ? data.pages.flatMap((d) => d.result).map((i) => ({ label: i.name, value: i.id })) : []),
    [data],
  );

  return (
    <AutoComplete
      emptyMessage="No driver found"
      options={allOptions}
      onLoadMore={fetchNextPage}
      isLoading={isFetching}
      hasMoreItems={hasNextPage}
      onValueChange={onValueChange}
      onSearch={onSearch}
    />
  );
};

export default DriverAutoComplete;
