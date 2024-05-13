import { ArrowPathIcon } from '@heroicons/react/20/solid';

export default function Loader({ size = 20 }: { size?: number }) {
  return <ArrowPathIcon width={size} height={size} className="animate-spin" />;
}
