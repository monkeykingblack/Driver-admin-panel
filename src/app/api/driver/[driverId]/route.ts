import { RideStatus, Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import * as v from 'valibot';

import { requestWrapper } from '~/libs/request-wrapper';
import { UpdateDriverSchema } from '~/schemas';
import { prisma } from '~/server/prisma';

export const GET = requestWrapper(
  async function GET(req: NextRequest, { params }: { params: Promise<{ driverId: string }> }) {
    const { driverId: id } = await params;

    const driver = await prisma.driver.findUniqueOrThrow({
      where: {
        id: id as string,
      },
      include: {
        vehicle: true,
        _count: {
          select: {
            rides: {
              where: {
                status: RideStatus.COMPLETED,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(driver);
  },
  { session: { canAccess: [Role.ADMIN] } },
);

export const PUT = requestWrapper(
  async function PUT(req: Request, { params }: { params: Promise<{ driverId: string }> }) {
    const { driverId: id } = await params;

    const { output: data, success, issues } = v.safeParse(UpdateDriverSchema, await req.json());

    if (!success) {
      return NextResponse.json(issues, { status: 400 });
    }

    const driver = await prisma.driver.update({
      where: {
        id: id as string,
      },
      data,
    });

    return NextResponse.json(driver);
  },
  { session: { canAccess: [Role.ADMIN] } },
);

export const PATCH = requestWrapper<{ driverId: string }>(
  async function PATCH(req: NextRequest, { params }) {
    const { driverId: id } = await params;

    const { output: data, success, issues } = v.safeParse(UpdateDriverSchema, await req.json());

    if (!success) {
      return NextResponse.json(issues, { status: 400 });
    }

    const driver = await prisma.driver.update({
      data,
      where: {
        id: id as string,
      },
    });
    return NextResponse.json(driver);

    return new NextResponse('Interner server error', { status: 500 });
  },
  { session: { canAccess: [Role.ADMIN] } },
);
