import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import CrossIcon from './CrossIcon';

function openModal(
  modalName: string,
  searchParams: URLSearchParams,
  pathname: String,
  router: AppRouterInstance,
  setModalOpen: (arg0: boolean) => void,
) {
  searchParams.set(modalName, 'true');

  const search = searchParams.toString();
  const query = search ? `?${search}` : '';
  router.push(`${pathname}${query}`);
  setModalOpen(true);
}

function closeModal(
  modalName: string,
  searchParams: URLSearchParams,
  pathname: String,
  router: AppRouterInstance,
  setModalOpen: (arg0: boolean) => void,
) {
  searchParams.delete(modalName);

  const search = searchParams.toString();
  const query = search ? `?${search}` : '';
  router.push(`${pathname}${query}`);
  setModalOpen(false);
}

function GenericModalWrapper({
  onModalClosed,
  children,
}: {
  onModalClosed: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-x-0 inset-y-0 z-50 flex h-screen w-screen items-center justify-center bg-neutral-950/35 xs:p-4 md:p-9">
      <style jsx global>{`
        body {
          overflow: hidden;
        }
      `}</style>
      <div className="z-60 relative flex h-screen max-h-full w-full max-w-[550px] scroll-p-6 flex-col gap-y-6 overflow-y-scroll bg-white p-6 xs:h-auto xs:rounded-xl">
        <CrossIcon
          width={24}
          height={24}
          onClick={onModalClosed}
          className="z-60 absolute right-3 top-3 p-1"
        />
        {children}
      </div>
    </div>
  );
}

export { closeModal, GenericModalWrapper, openModal };
