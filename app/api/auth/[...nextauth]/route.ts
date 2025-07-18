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
        console.log('NextAuth authorize called with:', { 
          email: credentials?.email, 
          hasPassword: !!credentials?.password,
          environment: process.env.NODE_ENV,
          nextAuthUrl: process.env.NEXTAUTH_URL
        });

        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }
        
        // Check if using demo credentials
        if (
          credentials.email === DEMO_USER_EMAIL && 
          credentials.password === DEMO_USER_PASSWORD
        ) {
          console.log('Demo user authentication successful');
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
          console.log('Attempting database connection...');
          await dbConnect();
          console.log('Database connected, searching for user...');
          
          // We need to cast this to any because our User type doesn't have password
          // but we know the database model does
          const user = await UserModel.findOne({ email: credentials.email }) as any;
          
          if (!user || !user.password) {
            console.log('User not found or no password');
            return null;
          }
          
          console.log('User found, validating password...');
          const isPasswordValid = await compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            console.log('Invalid password');
            return null;
          }
          
          console.log('Authentication successful for user:', user.email);
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
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log('SignIn callback called:', { 
        user: user?.email, 
        account: account?.provider,
        hasCredentials: !!credentials 
      });
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback called:', { url, baseUrl });
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
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
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
