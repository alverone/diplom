import { useRouter } from 'next/navigation';
import { ButtonPrimary } from '../Buttons';

export default function EmptyView({
  onBtnClicked,
}: {
  onBtnClicked?: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-3">
      <h2 className="font text-center text-lg font-medium text-neutral-950">
        Ваші товари зʼявляться тут.
      </h2>
      <ButtonPrimary
        label="До каталогу"
        onClick={() => {
          router.push('/');
          onBtnClicked && onBtnClicked();
        }}
        fullWidth={true}
      />
    </div>
  );
}
