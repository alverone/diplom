import { compare } from 'bcrypt';
import { getServerSession, NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from './prisma';

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          required: true,
          placeholder: '',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          wishesIds: user.wishesIds,
        } as AppSessionUser;
      },
    }),
  ],
  callbacks: {
    jwt: ({
      token,
      user,
    }: {
      token: JWT;
      user: AppSessionUser | AppAdapterUser;
    }) => {
      if (user) {
        return { ...token, id: user.id };
      } else {
        return token;
      }
    },
    session: ({ session, token }) => {
      if (token) {
        return {
          ...session,
          user: { ...session.user, id: token.id },
        };
      } else {
        return session;
      }
    },
  },
};

async function getAuthSession(): Promise<AppSession | null> {
  const session = await getServerSession(authOptions);

  return session ? (session as AppSession) : null;
}

export { authOptions, getAuthSession };
