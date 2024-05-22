import Footer from '@/components/Footer';
import Nav from '@/components/nav/Nav';
import NotFoundPlaceholder from '@/components/NotFoundPlaceholder';

export default function NotFound() {
  return (
    <>
      <Nav />
      <main>
        <NotFoundPlaceholder />
      </main>
      <Footer />
    </>
  );
}
