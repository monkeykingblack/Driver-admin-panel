import { Role } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextRequest, NextResponse } from 'next/server';
import * as v from 'valibot';

import { auth } from '~/consts/next-auth';
import { UpdateDriverSchema } from '~/schemas';
import { prisma } from '~/server/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ driverId: string }> }) {
  const session = await auth();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (session.user.role !== Role.ADMIN) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const { driverId: id } = await params;

  const driver = await prisma.driver.findUnique({
    where: {
      id: id as string,
    },
    include: {
      vehicle: true,
    },
  });

  if (driver === null) {
    return new NextResponse('Record not found', { status: 404 });
  }

  return NextResponse.json(driver);
}

export async function PUT(req: Request, { params }: { params: Promise<{ driverId: string }> }) {
  const session = await auth();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (session.user.role !== Role.ADMIN) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const { driverId: id } = await params;
  console.log(req.body);

  const { output: data, success, issues } = v.safeParse(UpdateDriverSchema, await req.json());

  if (!success) {
    return NextResponse.json(issues, { status: 400 });
  }

  try {
    const driver = await prisma.driver.update({
      where: {
        id: id as string,
      },
      data,
    });

    return NextResponse.json(driver);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === 'RecordNotFound') {
        return new NextResponse('Record not found', { status: 404 });
      }
    }
  }

  return new NextResponse('Interner server error', { status: 500 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ driverId: string }> }) {
  const session = await auth();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (session.user.role !== Role.ADMIN) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const { driverId: id } = await params;

  const { output: data, success, issues } = v.safeParse(UpdateDriverSchema, await req.json());

  if (!success) {
    return NextResponse.json(issues, { status: 400 });
  }

  try {
    const driver = await prisma.driver.update({
      data,
      where: {
        id: id as string,
      },
    });
    return NextResponse.json(driver);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === 'RecordNotFound') {
        return new NextResponse('Record not found', { status: 404 });
      }
    }
  }

  return new NextResponse('Interner server error', { status: 500 });
}
