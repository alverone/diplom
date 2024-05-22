import SessionProvider from '@/components/SessionProvider';
import StoreProvider from '@/components/StoreProvider';
import { getAppSession } from '@/lib/auth';

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAppSession();

  return (
    <StoreProvider>
      <SessionProvider session={session}>{children}</SessionProvider>
    </StoreProvider>
  );
}
