import Footer from '@/app/components/footer';
import styles from '@/app/components/layout.module.css';
import Nav from '@/app/components/nav';
import '@/app/globals.css';
import '@/app/normalize.css';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import SessionProvider from './components/session_provider/SessionProvider';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <Nav />
          <div className={styles.rootContainer}>{children}</div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
