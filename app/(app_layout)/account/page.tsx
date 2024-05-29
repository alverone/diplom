import LoadingView from '@/components/LoadingView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Акаунт',
};

export default function Page() {
  return (
    <main className="flex max-h-screen min-h-[512px] flex-col items-center justify-center">
      <LoadingView />
    </main>
  );
}
