import Loader from './Loader';

export default function LoadingView({ size = 32 }: { size?: number | null }) {
  return (
    <div className="flex h-96 flex-col items-center justify-center">
      <Loader size={size ?? 32} />
    </div>
  );
}
