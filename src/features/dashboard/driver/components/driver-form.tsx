import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { valibotResolver } from '@hookform/resolvers/valibot';
import { Gender } from '@prisma/client';
import { capitalize } from 'lodash';

import { Button } from '~/components/ui/button';
import { DateTimePicker } from '~/components/ui/date-time-picker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import { Spin } from '~/components/ui/spin';
import { CreateDriverSchema, ICreateDriver } from '~/schemas';

type Props = {
  defaultValues?: Partial<ICreateDriver>;
  onSubmit: (data: ICreateDriver) => PromiseLike<void>;
};

const DEFAULT_VALUE: Partial<ICreateDriver> = {
  contactNo: '',
  email: '',
  name: '',
  vehicle: {
    color: '',
    plateNumber: '',
    model: '',
  },
};

const DriverForm = ({ defaultValues = DEFAULT_VALUE, onSubmit }: Props) => {
  const form = useForm<ICreateDriver>({
    resolver: valibotResolver(CreateDriverSchema),
    defaultValues,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (data: ICreateDriver) => {
      setIsLoading(true);
      await onSubmit(data);
      setIsLoading(false);
    },
    [onSubmit],
  );

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
        </div>
        <Separator />
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
        <div>
          <h3 className="text-lg font-medium">Vehicle</h3>
        </div>
        <Separator />
        <FormField
          control={form.control}
          disabled={isLoading}
          name="vehicle.model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Model" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehicle.plateNumber"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plate number</FormLabel>
              <FormControl>
                <Input placeholder="Plate Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehicle.color"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input placeholder="Color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Spin />}
          Create
        </Button>
      </form>
    </Form>
  );
};

export default DriverForm;
