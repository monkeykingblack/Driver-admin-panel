import React, { FormEvent, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { valibotResolver } from '@hookform/resolvers/valibot';
import { Vehicle } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Descriptions } from '~/components/descriptions';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Spin } from '~/components/ui/spin';
import { ReactQueryKey } from '~/consts/react-api-keys';
import { axios } from '~/libs';
import { IUpdateVehicle, UpdateVehicleSchema } from '~/schemas';

const VehicleInformation = ({ vehicle: defaultValue }: { vehicle: Vehicle }) => {
  const [vehicle, setVehicle] = useState(defaultValue);

  const [isEdited, setIsEdited] = useState(false);

  const onSubmit = useCallback((data: Vehicle) => {
    setVehicle(data);
    setIsEdited(false);
  }, []);

  return (
    <Descriptions
      title="Vehicle"
      description="Vehicle information"
      extra={
        <Button variant="outline" onClick={() => setIsEdited(!isEdited)}>
          {isEdited ? 'Cancel' : 'Edit'}
        </Button>
      }
      items={[
        {
          key: 'model',
          label: 'Model',
          children: vehicle.model,
        },
        {
          key: 'plate-number',
          label: 'Plate number',
          children: vehicle.plateNumber,
        },
        {
          key: 'color',
          label: 'Color',
          children: vehicle.color,
        },
      ]}
    >
      {isEdited && <VehicleInformationForm defaultValues={vehicle} onSubmit={onSubmit} />}
    </Descriptions>
  );
};

export default VehicleInformation;

const VehicleInformationForm = ({
  defaultValues: { id, ...defaultValues },
  onSubmit,
}: {
  defaultValues: Vehicle;
  onSubmit: (data: Vehicle) => void;
}) => {
  const queryClient = useQueryClient();
  const form = useForm<IUpdateVehicle>({
    resolver: valibotResolver(UpdateVehicleSchema),
    defaultValues,
  });

  const { mutateAsync: updateDriver, isPending: isLoading } = useMutation({
    mutationFn: (data: IUpdateVehicle) =>
      axios.put<Vehicle>('/api/vehicle/' + id, data).then(({ data }) => data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ReactQueryKey.driverDetail(id) });
      queryClient.invalidateQueries({ queryKey: ReactQueryKey.driverList() });
      onSubmit(data);
      toast.info('Update success');
    },
  });

  const handleSubmit = useCallback(
    async (data: IUpdateVehicle) => {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value !== defaultValues[key as keyof IUpdateVehicle]),
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
          name="model"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input placeholder="Model" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plateNumber"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plate number</FormLabel>
              <FormControl>
                <Input placeholder="Plate number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input placeholder="color" {...field} />
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
