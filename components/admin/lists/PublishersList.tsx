'use client';

import GenericEditTile from '@/components/admin/GenericEditTile';
import { deletePublisher } from '@/lib/action';

export default function PublishersList({
  publishers,
}: {
  publishers: Publisher[];
}) {
  return publishers.map((p) => (
    <GenericEditTile
      editUrl={`/admin/publishers/${p.id}`}
      key={p.id}
      onDeleteCallback={() => deletePublisher(p.id)}
      deleteTitle={p.name}
      deleteDescription="Ви впевнені, що хочете видалити це видавництво?"
    >
      <div className="flex flex-row items-center gap-x-4">
        <p className="line-clamp-2 text-ellipsis text-base font-medium text-neutral-950">
          {p.name}
        </p>
      </div>
    </GenericEditTile>
  ));
}
