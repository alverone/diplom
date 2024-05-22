import LoadingView from '@/components/LoadingView';

export default function Page() {
  return (
    <main className="flex max-h-screen min-h-[512px] flex-col items-center justify-center">
      <LoadingView />
    </main>
  );
}
