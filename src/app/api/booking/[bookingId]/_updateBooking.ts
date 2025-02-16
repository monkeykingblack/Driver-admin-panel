import { Prisma, RideStatus } from '@prisma/client';

import { prisma } from '~/server/prisma';

export class RideBookingNotFoundError extends Error {
  constructor(id: string) {
    super(`Ride booking with ID ${id} not found`);
    this.name = 'RideBookingNotFoundError';
  }
}

export class InvalidRideStatusError extends Error {
  constructor(status: RideStatus) {
    super(`Cannot update ride booking with status ${status}`);
    this.name = 'InvalidRideStatusError';
  }
}

export default async function updateRideBooking(id: string, data: Prisma.RideBookingUpdateInput) {
  return prisma.$transaction(async (tx) => {
    const existingBooking = await tx.rideBooking.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!existingBooking) {
      throw new RideBookingNotFoundError(id);
    }

    if (existingBooking.status === RideStatus.CANCELED || existingBooking.status === RideStatus.COMPLETED) {
      throw new InvalidRideStatusError(existingBooking.status);
    }

    return tx.rideBooking.update({
      where: { id },
      data,
    });
  });
}
