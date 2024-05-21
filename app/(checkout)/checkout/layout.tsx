import CheckoutNav from '@/components/checkout/CheckoutNav';
import Drawers from '@/components/Drawers';
import Footer from '@/components/Footer';

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CheckoutNav />
      <div className="flex w-full flex-col items-center justify-center">
        {children}
        <Drawers />
      </div>
      <Footer />
    </>
  );
}
