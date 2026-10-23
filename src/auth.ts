import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import { parseLoginInput } from '@/lib/validation/user-input';
import { verifyPassword } from '@/server/auth/password';
import { findUserByEmail } from '@/server/services/user-service';

// Google es opcional: sin credenciales en .env.local la app funciona solo con correo y clave.
export const isGoogleAuthEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

const credentialsProvider = Credentials({
  credentials: { email: {}, password: {} },
  async authorize(credentials) {
    const login = parseLoginInput(credentials);
    if (!login.success) return null;

    const user = await findUserByEmail(login.data.email);
    if (!user?.passwordHash) return null;

    const isValidPassword = await verifyPassword(login.data.password, user.passwordHash);
    return isValidPassword ? { id: user.id, name: user.name, email: user.email, image: user.image } : null;
  },
});

const providers: Provider[] = isGoogleAuthEnabled ? [credentialsProvider, Google] : [credentialsProvider];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // El proveedor de credenciales solo funciona con sesiones JWT.
  session: { strategy: 'jwt' },
  providers,
  pages: { signIn: '/login', error: '/login' },
  callbacks: {
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
