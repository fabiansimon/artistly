import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { createUser, fetchUserByEmail } from '../../controllers/userController';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET!,
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log('user, account, profile', user, account, profile);
        if (!profile) return false;
        const { email, given_name, family_name, picture } = profile;

        if (!email) return false;

        let existingUser = await fetchUserByEmail(email);

        if (!existingUser) {
          existingUser = await createUser({
            email,
            first_name: given_name,
            last_name: family_name,
            image_url: picture,
          });
        }

        return true;
      } catch (error) {
        console.error('Error during sign-in:', error);
        return false;
      }
    },
    async session({ session, token }) {
      try {
        if (!session.user?.email) return false;
        const user = await fetchUserByEmail(session.user.email);

        if (user) {
          session.user.id = user.id;
          session.user.created_at = user.created_at;
          session.user.first_name = user.first_name;
          session.user.last_name = user.last_name;
          session.user.membership = user.membership;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        return session;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
