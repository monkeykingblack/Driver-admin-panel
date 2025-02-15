import { Role } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextRequest, NextResponse } from 'next/server';
import * as v from 'valibot';

import { auth } from '~/consts/next-auth';
import { UpdateVehicleSchema } from '~/schemas';
import { prisma } from '~/server/prisma';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ vehicleId: string }> }) {
  const session = await auth();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (session.user.role !== Role.ADMIN) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const { vehicleId: id } = await params;

  const { output: data, success, issues } = v.safeParse(UpdateVehicleSchema, await req.json());

  if (!success) {
    return NextResponse.json(issues, { status: 400 });
  }

  try {
    const vehicle = await prisma.vehicle.update({
      data,
      where: {
        id: id as string,
      },
    });

    return NextResponse.json(vehicle);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === 'RecordNotFound') {
        return new NextResponse('Record not found', { status: 404 });
      }
    }
  }
  return new NextResponse('Internal Server error', { status: 500 });
}
