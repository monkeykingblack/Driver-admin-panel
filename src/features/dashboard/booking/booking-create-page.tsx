import type { ICreateBooking } from '~/schemas';

import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { valibotResolver } from '@hookform/resolvers/valibot';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { ReactQueryKey } from '~/consts/react-api-keys';
import { axios } from '~/libs';
import { CreateBookingSchema } from '~/schemas';

import DriverAutoComplete from '../driver/components/driver-auto-complete';

type Props = {};

const BookingCreatePage = ({}: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<ICreateBooking>({
    resolver: valibotResolver(CreateBookingSchema),
    defaultValues: {
      customerName: '',
      dropoffLocation: '',
      pickupLocation: '',
    },
  });

  const { mutateAsync: createBooking } = useMutation({
    mutationFn: (data: ICreateBooking) => axios.post('/api/booking', data).then(({ data }) => data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ReactQueryKey.bookingList() });
      router.push({
        pathname: '/booking',
      });
    },
  });

  const handleSubmit = useCallback(
    (data: ICreateBooking) => {
      createBooking(data);
    },
    [createBooking],
  );

  return (
    <div className="flex-1 lg:max-w-2xl">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Customer name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pickupLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pick up location</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Customer name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dropoffLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drop off location</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Drop off location" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="driverId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Driver</FormLabel>
                <FormControl>
                  <DriverAutoComplete onValueChange={(value) => field.onChange(value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default BookingCreatePage;
