'use client';

import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import Modal from '@mui/material/Modal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ButtonPrimary, ButtonSecondary } from '../Buttons';

export default function GenericEditTile({
  children,
  editUrl,
  onDeleteCallback,
  deleteTitle,
  deleteDescription,
}: {
  children: React.ReactNode;
  editUrl: string;
  onDeleteCallback: () => void;
  deleteTitle: string;
  deleteDescription: string;
}) {
  const router = useRouter();
  const [isModalShown, setModalShown] = useState(false);

  return (
    <>
      <div className="flex w-full flex-row items-center justify-between gap-x-6 rounded-md bg-neutral-100 p-4">
        {children}
        <div className="flex flex-row items-center gap-x-2">
          <ButtonPrimary
            label={null}
            icon={<TrashIcon width={20} height={20} />}
            onClick={() => setModalShown(true)}
          />
          <ButtonPrimary
            label={null}
            icon={<PencilSquareIcon width={20} height={20} />}
            onClick={() => router.push(editUrl)}
          />
        </div>
      </div>
      <Modal
        open={isModalShown}
        onClose={() => setModalShown(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex h-screen flex-col items-center justify-center">
          <div className="absolute w-96 rounded-md bg-neutral-50 p-6 shadow-lg">
            <h2 className="mb-2 text-center text-xl font-bold text-neutral-950">
              {deleteTitle}
            </h2>
            <p className="mb-8 text-center text-base text-neutral-700">
              {deleteDescription}
            </p>
            <div className="flex flex-row gap-x-3">
              <ButtonPrimary
                label="Скасувати"
                onClick={() => setModalShown(false)}
                fullWidth
              />
              <ButtonSecondary
                label="Видалити"
                onClick={() => {
                  onDeleteCallback();
                  setModalShown(false);
                }}
                fullWidth
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
