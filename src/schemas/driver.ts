import { DriverStatus, Gender } from '@prisma/client';
import * as v from 'valibot';

import { CreateVehicleSchema } from './vehicle';

export const GetDriverQuerySchema = v.object({
  page: v.fallback(v.union([v.pipe(v.string(), v.transform(Number)), v.number()]), 1),
  pageSize: v.fallback(v.union([v.pipe(v.string(), v.transform(Number)), v.number()]), 10),
  search: v.optional(v.string()),
  status: v.optional(v.enum(DriverStatus)),
});

export type IGetDriverQuery = v.InferOutput<typeof GetDriverQuerySchema>;

export const CreateDriverSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  email: v.pipe(v.string(), v.email()),
  contactNo: v.pipe(v.string(), v.nonEmpty()),
  gender: v.enum(Gender),
  dateOfBirth: v.pipe(
    v.string(),
    v.nonEmpty(),
    v.transform((input) => new Date(input)),
    v.check((input) => {
      const now = new Date();
      const age = now.getFullYear() - input.getFullYear();
      return age >= 18 && age <= 60;
    }, 'Invalid date of birth. Age must be between 18 and 60 years old'),
  ),
  vehicle: CreateVehicleSchema,
});

export type ICreateDriver = v.InferOutput<typeof CreateDriverSchema>;

export const UpdateDriverSchema = v.partial(v.omit(CreateDriverSchema, ['vehicle']));

export type IUpdateDriver = v.InferOutput<typeof UpdateDriverSchema>;

export const UpdateDriverStatusSchema = v.object({
  status: v.enum(DriverStatus),
});

export type IUpdateDriverStatus = v.InferOutput<typeof UpdateDriverStatusSchema>;
