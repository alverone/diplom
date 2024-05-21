import Image from 'next/image';
import Link from 'next/link';
import NavLinkItem from './nav/NavLinkItem';

export default function Footer() {
  return (
    <footer className="mt-4 flex w-screen flex-col items-center justify-center bg-neutral-200 p-3 md:mt-6 md:px-9 md:py-6">
      <div className="flex w-full max-w-[1240px] flex-col-reverse items-center justify-between gap-x-4 gap-y-3 md:gap-6 lg:flex-row">
        <Link href="/">
          <Image src="/logo.svg" width={128} height={53.53} alt="" />
        </Link>

        <ol className="flex flex-row flex-wrap items-center justify-center ">
          <NavLinkItem text="Автори" href="/authors" />
          <NavLinkItem text="Категорії" href="/categories" />
          <NavLinkItem text="Видавництва" href="/publishers" />
        </ol>
      </div>
    </footer>
  );
}
