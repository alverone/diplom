'use client';

import i404 from '@/public/404.jpg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ButtonPrimary } from './Buttons';

export default function NotFoundPlaceholder() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-y-6 px-6 py-16">
      <Image
        src={i404}
        width={480}
        height={342}
        alt="The requested page could not be found"
      />
      <div className="gap-y flex flex-col items-center gap-y-3">
        <h1 className="text-2xl font-bold text-neutral-950">Упс!</h1>
        <p className="text-center text-xl text-neutral-800">
          Сторінка, яку ви шукаєте, більше не існує. <br />
          Вона могла бути видалена або переміщена.
        </p>
      </div>
      <ButtonPrimary label="На головну" onClick={() => router.replace('/')} />
    </div>
  );
}
