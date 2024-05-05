import {
  Book,
  BookRaw,
  BookType,
  BookSimplified,
  BookSimplifiedRaw,
} from './definitions';

/*export function toBook(book: BookRaw): Book {
  return {
    id: book.id,
    title: book.title,
    description: book.description,
    price: book.price,
    publish_date: book.publish_date,
    page_length: book.page_length,
    type: toBookType(book.type),
    category: { id: book.category_id, title: book.category_title },
    publisher: { id: book.publisher_id, name: book.publisher_name },
    author: { id: book.author_id, name: book.author_name },
  };
}*/

export function toBookSimplified(book: BookSimplifiedRaw): BookSimplified {
  return {
    id: book.id,
    title: book.title,
    price: book.price,
    author: { id: book.author_id, name: book.author_name },
    type: toBookType(book.type),
  };
}

export function toBookType(type: string) {
  return type == 'electronic' ? BookType.Electronic : BookType.Paper;
}
