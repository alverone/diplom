import { BookType } from '@prisma/client';

export default function BookEdition({ edition }: { edition: BookType }) {
  return (
    <p className="rounded bg-green-700 px-3 py-2 text-base font-medium text-white">
      {edition == BookType.ELECTRONIC ? 'Електронне' : 'Паперове'} видання
    </p>
  );
}
