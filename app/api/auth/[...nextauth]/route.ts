import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import dbConnect from '@/lib/mongoose';
import UserModel from '@/models/User';

// Demo user credentials from environment variables
const DEMO_USER_EMAIL = process.env.DEMO_USER_EMAIL || 'admin@example.com';
const DEMO_USER_PASSWORD = process.env.DEMO_USER_PASSWORD || 'password123';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        // Check if using demo credentials
        if (
          credentials.email === DEMO_USER_EMAIL && 
          credentials.password === DEMO_USER_PASSWORD
        ) {
          // Return a demo admin user without accessing the database
          const demoUser: NextAuthUser = {
            id: 'demo-user-id',
            email: DEMO_USER_EMAIL,
            name: 'Demo Admin',
            role: 'Admin',
          };
          return demoUser;
        }
        
        // Regular database authentication
        try {
          await dbConnect();
          
          // We need to cast this to any because our User type doesn't have password
          // but we know the database model does
          const user = await UserModel.findOne({ email: credentials.email }) as any;
          
          if (!user || !user.password) {
            return null;
          }
          
          const isPasswordValid = await compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            return null;
          }
          
          // Convert to NextAuth User format
          const authUser: NextAuthUser = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
          
          return authUser;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };