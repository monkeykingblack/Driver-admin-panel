import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { authOptions } from '~/consts/next-auth';
import { prisma } from '~/server/prisma';

async function retriveUserMe(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return void res.status(401).send({ message: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    omit: {
      hashedPassword: true,
    },
  });

  if (!user) {
    return void res.status(401).send({ message: 'Unauthorized' });
  }

  return void res.json({ user });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return retriveUserMe(req, res);
  }
}
