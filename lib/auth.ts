import { compare } from 'bcrypt';
import { getServerSession, NextAuthOptions } from 'next-auth';
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
          surname: user.surname,
          phone: user.phone,
        } as AppSessionUser;
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        const appUser = user as AppSessionUser | AppAdapterUser;
        return {
          ...token,
          id: appUser.id,
          surname: appUser.surname,
          phone: appUser.phone,
        };
      } else {
        return token;
      }
    },
    session: ({ session, token }) => {
      if (token) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id,
            surname: token.surname,
            phone: token.phone,
          },
        };
      } else {
        return session;
      }
    },
  },
};

async function getAppSession(): Promise<AppSession | null> {
  const session = await getServerSession(authOptions);

  return session ? (session as AppSession) : null;
}

export { authOptions, getAppSession };
