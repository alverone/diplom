import '@/app/globals.css';
import '@/app/normalize.css';
import styles from '@/app/ui/layout.module.css';
import Nav from '@/app/ui/nav';
import Footer from './ui/footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <div className={styles.rootContainer}>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
