import Image from 'next/image';
import Link from 'next/link';

export default function AdminNav() {
  return (
    <nav className="md:p-y-6 md:p-x-9 sticky top-0 mb-4 flex w-screen flex-col items-center justify-center gap-y-3 bg-white p-3 shadow-md md:mb-6 md:gap-y-6">
      <div className="flex w-full max-w-[1248px] flex-row flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <Link href="/" className="min-w-[100px]">
          <Image src="/logo.svg" width={100} height={41.4} alt="" />
        </Link>
        <h1 className="text-xl font-bold text-neutral-950">
          Панель адміністратора
        </h1>
      </div>
    </nav>
  );
}
