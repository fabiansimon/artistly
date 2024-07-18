// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      created_at: Date;
      first_name: string;
      last_name: string;
      email: string;
      image_url: string;
      membership: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    created_at: Date;
    first_name: string;
    last_name: string;
    email: string;
    image_url: string;
    membership: string;
  }
}
