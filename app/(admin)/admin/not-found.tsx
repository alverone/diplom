import { ButtonPrimary } from '@/components/Buttons';
import { getAppSession } from '@/lib/auth';
import i404 from '@/public/404.jpg';
import { UserRole } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function NotFound({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAppSession();

  if (!session || !session.user || session.user.role !== UserRole.ADMIN) {
    redirect('/login?fromAdmin=true');
  }

  return (
    <div className="flex flex-col items-center justify-center gap-y-6 px-6 py-16">
      <Image
        src={i404}
        width={240}
        height={171}
        alt="The requested page could not be found"
      />
      <div className="gap-y flex flex-col items-stretch gap-y-6">
        <h1 className="text-xl font-bold text-neutral-950">
          Елемент не знайдено
        </h1>
        <Link href="/admin">
          <ButtonPrimary label="До панелі" fullWidth />
        </Link>
      </div>
    </div>
  );
}
