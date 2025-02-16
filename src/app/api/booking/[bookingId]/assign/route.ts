import { NextRequest, NextResponse } from 'next/server';
import * as v from 'valibot';

import { requestWrapper } from '~/libs/request-wrapper';
import { AssignDriverBookingSchema } from '~/schemas';

import updateRideBooking, { InvalidRideStatusError, RideBookingNotFoundError } from '../_updateBooking';

export const PATCH = requestWrapper<{ bookingId: string }>(async function PATCH(
  req: NextRequest,
  { params },
) {
  const { bookingId: id } = await params;

  const { output: data, success, issues } = v.safeParse(AssignDriverBookingSchema, await req.json());

  if (!success) {
    return NextResponse.json(issues, { status: 400 });
  }

  try {
    const booking = await updateRideBooking(id, {
      driver: {
        connect: {
          id: data.driverId,
        },
      },
    });
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
