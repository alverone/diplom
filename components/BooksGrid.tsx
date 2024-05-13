import BookCard from './BookCard';
import Pagination from './Pagination';

export default function BooksGrid({
  books,
  pagesCount,
}: {
  books?: BookSimplified[];
  pagesCount: number;
}) {
  return (
    <div className="xs:py-6 flex w-full flex-col items-start justify-stretch gap-y-4 self-center py-4 sm:py-8 md:py-12">
      <div className="xs:grid xs:grid-cols-2 flex w-full flex-col justify-stretch gap-3 md:grid-cols-3">
        {books && books.map((e) => <BookCard book={e} key={e.id} />)}
      </div>
      <Pagination totalPages={pagesCount}></Pagination>
    </div>
  );
}
