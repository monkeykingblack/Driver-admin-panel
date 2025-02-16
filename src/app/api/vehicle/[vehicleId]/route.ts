import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import * as v from 'valibot';

import { requestWrapper } from '~/libs/request-wrapper';
import { UpdateVehicleSchema } from '~/schemas';
import { prisma } from '~/server/prisma';

export const PUT = requestWrapper<{ vehicleId: string }>(
  async function PUT(req: NextRequest, { params }) {
    const { vehicleId: id } = await params;

    const { output: data, success, issues } = v.safeParse(UpdateVehicleSchema, await req.json());

    if (!success) {
      return NextResponse.json(issues, { status: 400 });
    }

    const vehicle = await prisma.vehicle.update({
      data,
      where: {
        id: id as string,
      },
    });

    return NextResponse.json(vehicle);
  },
  {
    session: { canAccess: [Role.ADMIN] },
  },
);
