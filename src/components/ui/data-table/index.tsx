'use client';

import * as React from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';

import { Skeleton } from '../skeleton';
// import { DataTableToolbar } from './data-table-toolbar';
import { DataTablePagination } from './data-table-pagination';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  totalItems: number;
  pageSizeOptions?: number[];
  paginationState?: PaginationState & {
    onPageChange: OnChangeFn<PaginationState>;
  };
  onRowSelected?: (row: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data = [],
  loading,
  totalItems = 0,
  pageSizeOptions,
  paginationState,
  onRowSelected,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const tableData = React.useMemo(() => (loading ? Array(10).fill({} as TData) : data), [data, loading]);

  const tableColumns = React.useMemo(
    () =>
      loading
        ? columns.map((column) => ({ ...column, cell: () => <Skeleton className="flex h-8" /> }))
        : columns,
    [columns, loading],
  );

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    rowCount: totalItems,
    state: {
      rowSelection,
      pagination: paginationState,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: paginationState?.onPageChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: !!paginationState,
  });

  React.useEffect(() => {
    const handleSelectionState = (selections: RowSelectionState): TData[] => {
      return Object.keys(selections).map((key) => table.getSelectedRowModel().rowsById[key]?.original);
    };
    if (onRowSelected) {
      onRowSelected(handleSelectionState(rowSelection));
    }
  }, [onRowSelected, rowSelection, table]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
    </div>
  );
}
