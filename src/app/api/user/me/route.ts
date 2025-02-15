import { NextResponse } from 'next/server';

import { auth } from '~/consts/next-auth';
import { prisma } from '~/server/prisma';

export async function GET() {
  const session = await auth();

  if (session === null) {
    return new NextResponse('Unauthorized', {
      status: 401,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    omit: {
      hashedPassword: true,
    },
  });

  if (user === null) {
    return new NextResponse('Unauthorized', {
      status: 401,
    });
  }

  return NextResponse.json(user);
}
