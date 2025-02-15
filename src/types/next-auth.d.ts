import 'next-auth';
import 'next-auth/jwt';

export declare module 'next-auth' {
  interface User {
    role: string;
  }

  interface Session {
    user: User;
  }
}

export declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
  }
}
