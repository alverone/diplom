import '@/app/globals.css';
import Footer from '@/components/Footer';
import Nav from '@/components/nav/Nav';

import SessionProvider from '@/components/SessionProvider';
import StoreProvider from '@/components/StoreProvider';
import { getAuthSession } from '@/lib/auth';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <SessionProvider session={session}>
            <Nav />
            <div className="flex w-full flex-col items-center justify-center">
              {children}
            </div>
            <Footer />
          </SessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
