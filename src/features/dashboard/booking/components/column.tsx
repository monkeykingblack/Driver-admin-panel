'use client';

import type { Driver, RideBooking } from '@prisma/client';
import type { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '~/components/ui/checkbox';
import { DataTableColumnHeader } from '~/components/ui/data-table/data-table-column-header';

import BookingStatusBadge from './booking-status-badge';
import DataTableRowActions from './row-actions';

export const columns: ColumnDef<RideBooking & { driver: Driver }>[] = [
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
  },
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ride Id" />,
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[200px] truncate">
          <span className="">{row.getValue('id')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'customerName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer name" />,
    cell: ({ row }) => {
      return (
        <div className="flex max-w-[300px] items-center truncate lowercase">
          <span className="">{row.getValue('customerName')}</span>
        </div>
      );
    },
  },
  {
    id: 'driver.name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Driver name" />,
    cell: ({ row }) => {
      const value = row.original;
      return (
        <div className="flex items-center">
          <span>{value.driver.name}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'pickdropLocation',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Pick/Drop Address" />,
    cell: ({ row }) => {
      const value = row.original;
      return (
        <div className="w-[150px] items-center">
          <p>{value.pickupLocation} /</p>
          <p>{value.dropoffLocation}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <BookingStatusBadge row={row} />
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
