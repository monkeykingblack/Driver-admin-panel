import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import * as v from 'valibot';

import { requestWrapper } from '~/libs/request-wrapper';
import { CreateBookingSchema, GetBookingQuerySchema, IGetBookingQuery } from '~/schemas';
import { prisma } from '~/server/prisma';

export const GET = requestWrapper(async function GET(req: NextRequest) {
  const result = v.safeParse(GetBookingQuerySchema, Object.fromEntries(req.nextUrl.searchParams));
  const { page, pageSize, ...params }: IGetBookingQuery = result.success
    ? result.output
    : { page: 1, pageSize: 10 };

  const query: Prisma.RideBookingWhereInput = {};

  if (params.search) {
    query.OR = [{ id: params.search }];
  }

  if (params.from || params.to) {
    query.createdAt = {
      gte: params.from ? new Date(params.from) : undefined,
      lte: params.to ? new Date(params.to) : new Date(),
    };
  }

  if (params.status) {
    query.status = params.status;
  }

  if (params.driverId) {
    query.driverId = params.driverId;
  }

  const [bookings, totalBooking] = await prisma.$transaction([
    prisma.rideBooking.findMany({
      where: query,
      include: {
        driver: {
          select: {
            name: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.rideBooking.count({
      where: query,
    }),
  ]);

  return NextResponse.json({
    result: bookings,
    _meta: {
      page,
      pageSize,
      total: totalBooking,
    },
  });
});

export const POST = requestWrapper(async (req: NextRequest) => {
  const result = v.safeParse(CreateBookingSchema, await req.json());

  if (!result.success) {
    return NextResponse.json(result.issues, { status: 400 });
  }

  const { driverId, ...data } = result.output;
  const booking = await prisma.rideBooking.create({
    data: {
      ...data,
      status: driverId ? 'IN_PROGRESS' : 'PENDING',
      driver: driverId
        ? {
            connect: { id: driverId },
          }
        : undefined,
    },
  });
  return NextResponse.json(booking);
});
