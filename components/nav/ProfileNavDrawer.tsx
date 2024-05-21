import { toggleNav } from '@/lib/features/drawers/drawers_slice';
import { useAppDispatch } from '@/lib/hooks';
import {
  ArchiveBoxIcon,
  HeartIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import CrossIcon from '../CrossIcon';
import ProfileTab from '../ProfileTab';

export default function ProfileNavDrawer() {
  const dispatch = useAppDispatch();

  const closeModal = () => dispatch(toggleNav(false));

  return (
    <div className="flex w-screen max-w-[300px] flex-col gap-4 overflow-y-scroll p-4">
      <div className="mb-4 flex flex-row items-center justify-between gap-x-4">
        <h1 className="text-2xl font-semibold text-neutral-950">Мій кабінет</h1>
        <CrossIcon
          className="p-1"
          onClick={closeModal}
          width={24}
          height={24}
        />
      </div>
      <ProfileTab
        icon={<UserCircleIcon width={24} height={24} />}
        text="Особисті дані"
        href="/account/user"
        onClick={closeModal}
      />
      <ProfileTab
        icon={<HeartIcon width={24} height={24} />}
        text="Список бажаних"
        href="/account/wishlist"
        onClick={closeModal}
      />
      <ProfileTab
        icon={<ArchiveBoxIcon width={24} height={24} />}
        text="Історія замовлень"
        href="/account/orders"
        onClick={closeModal}
      />
      <ProfileTab text="Вихід" href="/signout" onClick={closeModal} />
    </div>
  );
}
