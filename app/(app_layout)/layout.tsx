import '@/app/globals.css';
import Footer from '@/components/Footer';
import Nav from '@/components/nav/Nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <div className="flex w-full flex-col items-center justify-center">
        {children}
      </div>
      <Footer />
    </>
  );
}
