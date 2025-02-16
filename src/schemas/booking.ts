import { RideStatus } from '@prisma/client';
import * as v from 'valibot';

export const GetBookingQuerySchema = v.object({
  page: v.fallback(v.union([v.pipe(v.string(), v.transform(Number)), v.number()]), 1),
  pageSize: v.fallback(v.union([v.pipe(v.string(), v.transform(Number)), v.number()]), 10),
  search: v.optional(v.string()),
  status: v.optional(v.enum(RideStatus)),
  driverId: v.optional(v.string()),
  from: v.optional(
    v.pipe(
      v.string(),
      v.nonEmpty(),
      v.transform((input) => new Date(input)),
    ),
  ),
  to: v.optional(
    v.pipe(
      v.string(),
      v.nonEmpty(),
      v.transform((input) => new Date(input)),
    ),
  ),
});

export type IGetBookingQuery = v.InferOutput<typeof GetBookingQuerySchema>;

export const CreateBookingSchema = v.object({
  customerName: v.pipe(v.string(), v.nonEmpty()),
  driverId: v.pipe(v.string(), v.nonEmpty(), v.cuid2()),
  pickupLocation: v.pipe(v.string(), v.nonEmpty()),
  dropoffLocation: v.pipe(v.string(), v.nonEmpty()),
});

export type ICreateBooking = v.InferOutput<typeof CreateBookingSchema>;

export const UpdateBookingSchema = v.partial(v.omit(CreateBookingSchema, ['driverId']));

export type IUpdateBooking = v.InferOutput<typeof UpdateBookingSchema>;

export const AssignDriverBookingSchema = v.object({
  driverId: v.pipe(v.string(), v.cuid2()),
});

export type IAssignDriverBooking = v.InferOutput<typeof AssignDriverBookingSchema>;
