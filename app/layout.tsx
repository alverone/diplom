import '@/app/globals.css';

import Drawers from '@/components/Drawers';
import SessionProvider from '@/components/SessionProvider';
import StoreProvider from '@/components/StoreProvider';
import { getAppSession } from '@/lib/auth';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAppSession();

  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <SessionProvider session={session}>
            {children}
            <Drawers />
          </SessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
