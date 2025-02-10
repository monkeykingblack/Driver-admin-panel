import NextAuth from 'next-auth';

import { authOptions } from '~/consts/next-auth';

export default NextAuth(authOptions);
