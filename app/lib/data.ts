import { sql } from '@vercel/postgres';
import {
  Publisher,
  Author,
  Category,
  Book,
  BookRaw,
  BookSimplifiedRaw,
} from './definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { toBookSimplified } from './mappers';

export async function fetchPublishers() {
  noStore();

  try {
    const data = await sql<Publisher>`SELECT * FROM publishers`;

    return data.rows;
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}

export async function fetchAuthors() {
  noStore();
  try {
    const data = await sql<Author>`SELECT * FROM authors`;

    return data.rows;
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}

export async function fetchAuthorById(id: string) {
  try {
    const data =
      await sql<Author>`SELECT * FROM authors WHERE id=${id} LIMIT 1;`;

    return data.rows[0];
  } catch (e) {
    console.error('DatabaseError:', e);
    return null;
  }
}

export async function fetchPublisherById(id: string) {
  try {
    const data =
      await sql<Publisher>`SELECT * FROM publishers WHERE id=${id} LIMIT 1;`;

    return data.rows[0];
  } catch (e) {
    console.error('DatabaseError:', e);
    return null;
  }
}

export async function fetchCategoryById(id: string) {
  try {
    const data =
      await sql<Category>`SELECT * FROM categories WHERE id=${id} LIMIT 1;`;

    return data.rows[0];
  } catch (e) {
    console.error('DatabaseError:', e);
    return null;
  }
}

export async function fetchCategories() {
  noStore();

  try {
    const data = await sql<Category>`SELECT * FROM categories`;

    return data.rows;
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}

/*export async function fetchBooks(currentPage: number): Promise<Book[]> {
  noStore();

  try {
    const offset = (currentPage - 1) * 6;

    const allBooksRaw = await sql<BookRaw>`SELECT books.*, 
        authors.id AS author_id,
        authors.name AS author_name,
        categories.title AS category_title,
        categories.id AS category_id,
        publishers.name AS publisher_name,
        publishers.id AS publisher_id
      FROM books
      JOIN authors ON authors.id=books.author
      JOIN categories ON categories.id=books.category
      JOIN publishers ON publishers.id=books.publisher
      LIMIT 6 OFFSET ${offset};`;

    const allBooks = allBooksRaw.rows.map((b) => toBook(b));

    return allBooks;
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}*/

export async function fetchBooksSimplified(currentPage: number) {
  noStore();

  try {
    const offset = (currentPage - 1) * 6;

    const allBooksRaw = await sql<BookSimplifiedRaw>`SELECT books.id,
        books.title,
        books.price,
        books.type,
        authors.id AS author_id,
        authors.name AS author_name
      FROM books
      INNER JOIN authors ON authors.id=books.author
      LIMIT 6 OFFSET ${offset};`;

    const allBooks = allBooksRaw.rows.map((b) => toBookSimplified(b));

    return allBooks;
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}

export async function fetchBooksSimplifiedByAuthor(
  currentPage: number,
  authorId: string,
) {
  noStore();

  try {
    const offset = (currentPage - 1) * 6;

    const allBooksRaw = await sql<BookSimplifiedRaw>`SELECT books.id,
        books.title,
        books.price,
        books.type,
        authors.id AS author_id,
        authors.name AS author_name
      FROM books
      INNER JOIN authors ON authors.id=books.author
      WHERE authors.id=${authorId}
      LIMIT 6 OFFSET ${offset};`;

    const allBooks = allBooksRaw.rows.map((b) => toBookSimplified(b));

    return allBooks;
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}

export async function fetchBooksSimplifiedByPublisher(
  currentPage: number,
  publisherId: string,
) {
  noStore();

  try {
    const offset = (currentPage - 1) * 6;

    const allBooksRaw = await sql<BookSimplifiedRaw>`SELECT books.id,
        books.title,
        books.price,
        books.type,
        authors.id AS author_id,
        authors.name AS author_name
      FROM books
      INNER JOIN authors ON authors.id=books.author
      INNER JOIN publishers ON publishers.id=books.publisher
      WHERE publishers.id=${publisherId}
      LIMIT 6 OFFSET ${offset};`;

    const allBooks = allBooksRaw.rows.map((b) => toBookSimplified(b));

    return allBooks;
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}

export async function fetchBooksSimplifiedByCategory(
  currentPage: number,
  categoryId: string,
) {
  noStore();

  try {
    const offset = (currentPage - 1) * 6;

    const allBooksRaw = await sql<BookSimplifiedRaw>`SELECT books.id,
        books.title,
        books.price,
        books.type,
        authors.id AS author_id,
        authors.name AS author_name
      FROM books
      INNER JOIN authors ON authors.id=books.author
      INNER JOIN categories ON categories.id=books.category
      WHERE categories.id=${categoryId}
      LIMIT 6 OFFSET ${offset};`;

    const allBooks = allBooksRaw.rows.map((b) => toBookSimplified(b));

    return allBooks;
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}

export async function fetchBooksSimplifiedByAuthorCount(authorId: string) {
  noStore();

  try {
    const data = await sql`SELECT COUNT(*)
      FROM books
      INNER JOIN authors ON authors.id=books.author
      WHERE authors.id=${authorId}`;

    const numberOfPages = Number(data.rows[0].count ?? '0') / 6;

    return numberOfPages < 1 ? 1 : Math.ceil(numberOfPages);
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}

export async function fetchBooksSimplifiedByPublisherCount(
  publisherId: string,
) {
  noStore();

  try {
    const data = await sql`SELECT COUNT(*)
      FROM books
      INNER JOIN publishers ON publishers.id=books.publisher
      WHERE publishers.id=${publisherId}`;

    const numberOfPages = Number(data.rows[0].count ?? '0') / 6;

    return numberOfPages < 1 ? 1 : Math.ceil(numberOfPages);
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}

export async function fetchBooksSimplifiedByCategoryCount(categoryId: string) {
  noStore();

  try {
    const data = await sql`SELECT COUNT(*)
      FROM books
      INNER JOIN categories ON categories.id=books.category
      WHERE categories.id=${categoryId}`;

    const numberOfPages = Number(data.rows[0].count ?? '0') / 6;

    return numberOfPages < 1 ? 1 : Math.ceil(numberOfPages);
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}

export async function fetchBookById(id: string) {
  noStore();
  try {
    const book = (
      await sql<BookRaw>`
      SELECT *
      FROM books
      WHERE id=${id} LIMIT 1;`
    ).rows[0];

    if (!book) {
      return null;
    }

    const [author, category, publisher] = await Promise.all([
      sql<Author>`SELECT *
        FROM authors
        WHERE authors.id=${book.author}`,
      sql<Category>`SELECT *
        FROM categories
        WHERE categories.id=${book.category}`,
      sql<Publisher>`SELECT *
        FROM publishers
        WHERE publishers.id=${book.publisher}`,
    ]);

    const bookTyped = (<unknown>{
      ...book,
      author: author.rows[0],
      category: category.rows[0],
      publisher: publisher.rows[0],
    }) as Book;

    return bookTyped as Book;
  } catch (e) {
    console.error('DatabaseError:', e);
    return null;
  }
}

export async function fetchBookPagesCount() {
  try {
    const data = await sql`SELECT COUNT(*) from books;`;

    const numberOfPages = Number(data.rows[0].count ?? '0') / 6;

    return numberOfPages < 1 ? 1 : Math.ceil(numberOfPages);
  } catch (e) {
    console.error('foobar:', e);
    throw e;
    return 1;
  }
}

/*export async function drop() {
  await sql`DROP TABLE IF EXISTS revenue;`;
  await sql`DROP TABLE IF EXISTS customers;`;
  await sql`DROP TABLE IF EXISTS invoices;`;
  await sql`DROP TABLE IF EXISTS users;`;
}*/

export async function createIfNotExistsAuthor(
  authorName: string,
): Promise<Author | undefined> {
  try {
    await sql`INSERT INTO authors (name)
    VALUES(${authorName})
    ON CONFLICT (name) DO NOTHING;`;
    const data = await sql<Author>`SELECT *
      FROM authors
      WHERE UPPER(name)=UPPER(${authorName})
      LIMIT 1;`;

    return data.rows[0];
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}

export async function createIfNotExistsCategory(
  categoryTitle: string,
): Promise<Category | undefined> {
  try {
    await sql`INSERT INTO categories (title)
    VALUES(${categoryTitle})
    ON CONFLICT (id) DO NOTHING;`;
    const data = await sql<Category>`SELECT *
      FROM categories
      WHERE title=${categoryTitle}
      LIMIT 1;`;

    return data.rows[0];
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}

export async function createIfNotExistsPublisher(
  publisherName: string,
  description?: string,
): Promise<Publisher | undefined> {
  try {
    await sql`INSERT INTO publishers (name, description)
    VALUES(${publisherName}, ${!description ? null : description})
    ON CONFLICT (id) DO NOTHING;`;
    const data = await sql<Publisher>`SELECT *
      FROM publishers
      WHERE name=${publisherName}
      LIMIT 1;`;

    return data.rows[0];
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}

/*export async function createBook(
  bookPayload: BookPayload,
): Promise<Book | undefined> {
  try {
    const [author, publisher, category] = await Promise.all([
      createIfNotExistsAuthor(bookPayload.author_name),
      createIfNotExistsCategory(bookPayload.category_title),
      createIfNotExistsPublisher(bookPayload.publisher_name),
    ]);

    const {
      title,
      description,
      price,
      publish_date,
      page_length,
      type,
      imageUrl,
    } = bookPayload;

    await sql`
    INSERT INTO books (title, description, price, publish_date, page_length, type, imageUrl, author, publisher, category)
    VALUES(${title}, ${description}, ${price}, ${
      publish_date.toISOString().split('T')[0]
    }, ${page_length}, ${type}, ${!imageUrl ? null : imageUrl}, ${
      author!.id
    }, ${category!.id}, ${publisher!.id});`;

    const book = await sql<BookRaw>`
    SELECT *
    FROM books
    WHERE title=${title} LIMIT 1;`;

    return toBook(book.rows[0]);
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}*/

export async function fetchBooksSimplifiedFiltered(
  term: string,
  currentPage: number,
) {
  noStore();

  try {
    if (term.trim().length == 0) {
      return [];
    }

    const offset = (currentPage - 1) * 6;
    const q = `%${term}%`;

    const allBooksRaw = await sql<BookSimplifiedRaw>`
    SELECT 
      books.id,
      books.title,
      books.price,
      books.type,
      authors.id AS author_id,
      authors.name AS author_name
    FROM books
    INNER JOIN authors ON authors.id=books.author
    INNER JOIN publishers ON publishers.id=books.publisher
    INNER JOIN categories ON categories.id=books.category
    WHERE UPPER(books.title) ILIKE UPPER(${q}) OR
      books.publish_date::text ILIKE ${q} OR
      books.description ILIKE ${q} OR
      authors.name ILIKE ${q} OR
      publishers.name ILIKE ${q} OR
      categories.title ILIKE ${q}
      LIMIT 6 OFFSET ${offset};`;

    const allBooks = allBooksRaw.rows.map((b) => toBookSimplified(b));

    return allBooks;
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}

export async function fetchBooksSimplifiedFilteredCount(term: string) {
  noStore();

  try {
    const q = `%${term}%`;

    const allBooksRaw = await sql`
    SELECT 
      COUNT(*)
    FROM books
    INNER JOIN authors ON authors.id=books.author
    INNER JOIN publishers ON publishers.id=books.publisher
    INNER JOIN categories ON categories.id=books.category
    WHERE books.title ILIKE ${q} OR
      books.publish_date::text ILIKE ${q} OR
      books.description ILIKE ${q} OR
      authors.name ILIKE ${q} OR
      publishers.name ILIKE ${q} OR
      categories.title ILIKE ${q};`;

    return Math.ceil(Number(allBooksRaw.rows[0].count || '1') / 6);
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}
