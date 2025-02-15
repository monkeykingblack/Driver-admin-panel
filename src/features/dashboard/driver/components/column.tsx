'use client';

import { Driver, DriverStatus } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '~/components/ui/badge';
import { Checkbox } from '~/components/ui/checkbox';
import { DataTableColumnHeader } from '~/components/ui/data-table/data-table-column-header';

import DriverStatusBadge from './driver-status-badge';
import { DataTableRowActions } from './row-actions';

export const columns: ColumnDef<Driver>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'index',
    // header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    header: '#',
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => (
      <div className="flex w-[50px] items-center">
        <span>{row.index + 1}</span>
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[300px] truncate">
          <span className="">{row.getValue('name')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[300px] items-center truncate lowercase">
          <span className="">{row.getValue('email')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'contactNo',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Contact No." />,
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span>{row.getValue('contactNo')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'review',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Review" />,
    cell: ({ row }) => {
      const value = row.getValue<number>('review') || '--';

      return (
        <div className="flex items-center">
          <span>{value}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <DriverStatusBadge driver={row.original} />
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
