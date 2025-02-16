import { NextRequest, NextResponse } from 'next/server';
import * as v from 'valibot';

import { NextResponseError } from '~/libs/errors/next-response-error';
import { requestWrapper } from '~/libs/request-wrapper';
import { UpdateBookingSchema } from '~/schemas';
import { prisma } from '~/server/prisma';

import updateRideBooking, { InvalidRideStatusError, RideBookingNotFoundError } from './_updateBooking';

export const GET = requestWrapper(async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ driverId: string }> },
) {
  const { driverId: id } = await params;

  const driver = await prisma.rideBooking.findUnique({
    where: {
      id: id as string,
    },
    include: {
      driver: {
        select: {
          name: true,
        },
      },
    },
  });

  if (driver === null) {
    return NextResponseError.recordNotFound();
  }

  return NextResponse.json(driver);
});

export const PUT = requestWrapper(async function PUT(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  const { bookingId: id } = await params;

  const { output: data, success, issues } = v.safeParse(UpdateBookingSchema, await req.json());

  if (!success) {
    return NextResponse.json(issues, { status: 400 });
  }

  try {
    const booking = await updateRideBooking(id, data);

    return NextResponse.json(booking);
  } catch (e) {
    if (e instanceof RideBookingNotFoundError) {
      return new NextResponse(e.message, { status: 404 });
    }
    if (e instanceof InvalidRideStatusError) {
      return new NextResponse(e.message, { status: 422 });
    }
    throw e;
  }
});
