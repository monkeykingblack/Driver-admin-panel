import { NextRequest, NextResponse } from 'next/server';
import * as v from 'valibot';

import { CreateDriverSchema, GetDriverQuerySchema, IGetDriverQuery } from '~/schemas';
import { prisma } from '~/server/prisma';

export async function GET(req: NextRequest) {
  const result = v.safeParse(GetDriverQuerySchema, Object.fromEntries(req.nextUrl.searchParams));
  const { page, pageSize, ...params }: IGetDriverQuery = result.success
    ? result.output
    : { page: 1, pageSize: 10 };

  const query = params.search
    ? {
        name: { contains: params.search },
      }
    : {};

  const [data, total] = await prisma.$transaction([
    prisma.driver.findMany({
      where: query,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.driver.count({
      where: query,
    }),
  ]);

  return NextResponse.json({
    result: data,
    _meta: {
      page,
      pageSize,
      total,
    },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = v.safeParse(CreateDriverSchema, body);

  if (!result.success) {
    return NextResponse.json(result.issues, { status: 400 });
  }
  try {
    const { vehicle, ...data } = result.output;

    const driver = await prisma.driver.create({
      data: {
        ...data,
        vehicle: {
          create: vehicle,
        },
      },
    });
    return NextResponse.json(driver);
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
