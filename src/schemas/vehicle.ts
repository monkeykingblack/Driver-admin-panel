import * as v from 'valibot';

export const CreateVehicleSchema = v.object({
  model: v.pipe(v.string(), v.nonEmpty()),
  color: v.pipe(v.string(), v.nonEmpty()),
  plateNumber: v.pipe(v.string(), v.nonEmpty()),
});

export type ICreateVehicle = v.InferOutput<typeof CreateVehicleSchema>;

export const UpdateVehicleSchema = v.partial(CreateVehicleSchema);

export type IUpdateVehicle = v.InferOutput<typeof UpdateVehicleSchema>;
