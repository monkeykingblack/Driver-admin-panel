import React, { FormEvent, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { valibotResolver } from '@hookform/resolvers/valibot';
import { Driver, Gender } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { capitalize } from 'lodash';
import { toast } from 'sonner';

import { Descriptions } from '~/components/descriptions';
import { Button } from '~/components/ui/button';
import { DateTimePicker } from '~/components/ui/date-time-picker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Spin } from '~/components/ui/spin';
import { ReactQueryKey } from '~/consts/react-api-keys';
import { axios } from '~/libs';
import { IUpdateDriver, UpdateDriverSchema } from '~/schemas';

import DriverStatusBadge from './driver-status-badge';

const DriverInformation = ({ driver: defaultValue }: { driver: Driver }) => {
  const [driver, setDriver] = useState(defaultValue);
  const [isEdit, setIsEdit] = useState(false);

  const onSubmit = (newData: Driver) => {
    setDriver(newData);
    setIsEdit(false);
  };

  return (
    <Descriptions
      title="Driver information"
      description="Personal details and general information"
      extra={
        <div className="flex flex-row-reverse gap-4">
          <Button variant="outline" onClick={() => setIsEdit(!isEdit)}>
            {isEdit ? 'Cancel' : 'Edit'}
          </Button>
          {!isEdit && (
            <Button variant={driver.status === 'APPROVED' ? 'destructive' : 'default'}>
              {driver.status === 'APPROVED' ? 'Block' : driver.status === 'PENDING' ? 'Approve' : 'Unblock'}
            </Button>
          )}
        </div>
      }
      items={[
        {
          key: 'name',
          label: 'Full name',
          children: driver.name,
        },
        {
          key: 'dob',
          label: 'Date of birth',
          children: format(driver.dateOfBirth, 'dd/MM/yyyy'),
        },
        {
          key: 'gender',
          label: 'Gender',
          children: capitalize(driver.gender),
        },
        {
          key: 'email',
          label: 'Email',
          children: driver.email,
        },
        {
          key: 'contact',
          label: 'Contact',
          children: driver.contactNo,
        },
        {
          key: 'updated',
          label: 'Updated at',
          children: format(driver.createdAt, 'LLLL'),
        },
        {
          key: 'status',
          label: 'Status',
          children: <DriverStatusBadge driver={driver} />,
        },
      ]}
    >
      {isEdit ? <DriverInfromationForm defaultValues={driver} onSubmit={onSubmit} /> : undefined}
    </Descriptions>
  );
};

export default DriverInformation;

const DriverInfromationForm = ({
  defaultValues: { id, ...defaultValues },
  onSubmit,
}: {
  defaultValues: Driver;
  onSubmit: (data: Driver) => void;
}) => {
  const queryClient = useQueryClient();
  const form = useForm<IUpdateDriver>({
    resolver: valibotResolver(UpdateDriverSchema),
    defaultValues,
  });

  const { mutateAsync: updateDriver, isPending: isLoading } = useMutation({
    mutationFn: (data: IUpdateDriver) =>
      axios.put<Driver>('/api/driver/' + id, data).then(({ data }) => data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ReactQueryKey.driverDetail(id) });
      queryClient.invalidateQueries({ queryKey: ReactQueryKey.driverList() });
      onSubmit(data);
      toast.info('Update success');
    },
  });

  const handleSubmit = useCallback(
    async (data: IUpdateDriver) => {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value !== defaultValues[key as keyof IUpdateDriver]),
      );
      await updateDriver(filteredData);
    },
    [defaultValues, updateDriver],
  );

  const handleReset = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      form.reset();
    },
    [form],
  );

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)} onReset={handleReset}>
        <FormField
          control={form.control}
          name="name"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <FormControl>
                <DateTimePicker
                  granularity="day"
                  onChange={(value) => field.onChange(value?.toDateString())}
                  value={field.value ? new Date(field.value) : undefined}
                  displayFormat={{
                    hour12: 'dd/MM/yyyy',
                    hour24: 'dd/MM/yyyy',
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} {...field}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Gender).map((value) => (
                    <SelectItem value={value} key={`gender-${value}`}>
                      {capitalize(value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactNo"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact phone number</FormLabel>
              <FormControl>
                <Input placeholder="+123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <Button variant="outline" type="reset">
            Reset
          </Button>
          <Button type="submit">
            {isLoading && <Spin />}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
