import { BookType } from '@prisma/client';
import prisma from './prisma';

export enum SortOrder {
  PriceAsc = 'price_asc',
  PriceDesc = 'price_desc',
  TitleAsc = 'title_asc',
  TitleDesc = 'title_desc',
  Time = 'time',
}

function getSortOrder(sortOrder: SortOrder | null):
  | {
      [key: string]: 'asc' | 'desc';
    }
  | undefined {
  if (!sortOrder) {
    return undefined;
  }

  switch (sortOrder) {
    case SortOrder.PriceAsc:
      return { price: 'asc' };
    case SortOrder.PriceDesc:
      return { price: 'desc' };
    case SortOrder.TitleAsc:
      return { title: 'asc' };
    case SortOrder.TitleDesc:
      return { title: 'desc' };
    case SortOrder.Time:
      return { publishDate: 'desc' };
    default:
      return undefined;
  }
}

export async function fetchAuthorById(id: string) {
  try {
    const author = await prisma?.author.findUnique({
      where: { id: id },
    });

    if (!author) {
      return null;
    } else {
      return author as Author;
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return null;
  }
}

export async function fetchAllAuthors(): Promise<Author[]> {
  try {
    const authors = await prisma?.author.findMany();

    if (!authors) {
      return [];
    } else {
      return authors as Author[];
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}

export async function fetchPublisherById(id: string) {
  try {
    const publisher = await prisma?.publisher.findUnique({
      where: { id: id },
    });

    if (!publisher) {
      return null;
    } else {
      return publisher as Publisher;
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return null;
  }
}

export async function fetchAllPublishers(): Promise<Publisher[]> {
  try {
    const publishers = await prisma?.publisher.findMany();

    if (!publishers) {
      return [];
    } else {
      return publishers as Publisher[];
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}

export async function fetchCategoryById(id: string): Promise<Category | null> {
  try {
    const category = await prisma?.category.findUnique({
      where: { id: id },
    });

    if (!category) {
      return null;
    } else {
      return category as Category;
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return null;
  }
}

export async function fetchAllCategories(): Promise<Category[]> {
  try {
    const categories = await prisma?.category.findMany();

    if (!categories) {
      return [];
    } else {
      return categories as Category[];
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}

export async function fetchSimpleBooks(
  currentPage: number,
  sortOrder: SortOrder | null,
) {
  try {
    const offset = (currentPage - 1) * 6;

    const bookPage = await prisma?.book.findMany({
      take: 6,
      skip: offset,
      select: {
        id: true,
        type: true,
        price: true,
        authorId: true,
        author: true,
        title: true,
      },
      orderBy: getSortOrder(sortOrder),
    });

    if (!bookPage) {
      return [];
    } else {
      return bookPage as BookSimplified[];
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}

export async function fetchSimpleBooksByAuthor(
  currentPage: number,
  authorId: string,
  sortOrder: SortOrder | null,
) {
  try {
    const offset = (currentPage - 1) * 6;

    const bookPage = await prisma?.book.findMany({
      where: {
        authorId: authorId,
      },
      take: 6,
      skip: offset,
      select: {
        id: true,
        type: true,
        price: true,
        authorId: true,
        author: true,
        title: true,
      },
      orderBy: getSortOrder(sortOrder),
    });

    if (!bookPage) {
      return [];
    } else {
      return bookPage as BookSimplified[];
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}

export async function fetchSimpleBooksByPublisher(
  currentPage: number,
  publisherId: string,
  sortOrder: SortOrder | null,
) {
  try {
    const offset = (currentPage - 1) * 6;

    const bookPage = await prisma?.book.findMany({
      where: {
        publisherId: publisherId,
      },
      take: 6,
      skip: offset,
      select: {
        id: true,
        type: true,
        price: true,
        authorId: true,
        author: true,
        title: true,
      },
      orderBy: getSortOrder(sortOrder),
    });

    if (!bookPage) {
      return [];
    } else {
      return bookPage as BookSimplified[];
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}

export async function fetchSimpleBooksByCategory(
  currentPage: number,
  categoryId: string,
  sortOrder: SortOrder | null,
) {
  try {
    const offset = (currentPage - 1) * 6;

    const bookPage = await prisma?.book.findMany({
      where: {
        categoryId: categoryId,
      },
      take: 6,
      skip: offset,
      select: {
        id: true,
        type: true,
        price: true,
        authorId: true,
        author: true,
        title: true,
      },
      orderBy: getSortOrder(sortOrder),
    });

    if (!bookPage) {
      return [];
    } else {
      return bookPage as BookSimplified[];
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}

export async function fetchSimpleBooksCountByAuthor(authorId: string) {
  try {
    const authorBooks = await prisma?.book.count({
      where: { authorId: authorId },
    });

    const numberOfPages = authorBooks ? authorBooks / 6 : 1;

    return Math.max(Math.ceil(numberOfPages), 1);
  } catch (e) {
    console.error('DatabaseError:', e);
    return 1;
  }
}

export async function fetchSimpleBooksCountByPublisher(publisherId: string) {
  try {
    const publisherBooks = await prisma?.book.count({
      where: { publisherId: publisherId },
    });

    const numberOfPages = publisherBooks ? publisherBooks / 6 : 1;

    return Math.max(Math.ceil(numberOfPages), 1);
  } catch (e) {
    console.error('DatabaseError:', e);
    return 1;
  }
}

export async function fetchSimpleBooksCountByCategory(
  categoryId: string,
): Promise<number> {
  try {
    const categoryBooks = await prisma?.book.count({
      where: {
        categoryId: categoryId,
      },
    });

    const numberOfPages = categoryBooks ? categoryBooks / 6 : 1;

    if (!isFinite(numberOfPages)) {
      return 1;
    }

    return Math.max(Math.ceil(numberOfPages), 1);
  } catch (e) {
    console.error('DatabaseError:', e);
    return 1;
  }
}

export async function fetchBookById(id: string): Promise<Book | null> {
  try {
    const book = await prisma?.book.findUnique({
      where: { id: id },
      include: {
        publisher: true,
        author: true,
        category: true,
      },
    });

    if (!book) {
      return null;
    } else {
      return book as Book;
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return null;
  }
}

export async function fetchBookPagesCount() {
  try {
    const bookCount = await prisma?.book.count();

    const numberOfPages = Number(bookCount ?? '0') / 6;

    return numberOfPages < 1 ? 1 : Math.ceil(numberOfPages);
  } catch (e) {
    console.error('DatabaseError:', e);
    return 1;
  }
}

export async function fetchOrdersPagesCount(userId: string) {
  try {
    const orderCount = await prisma?.order.count({
      where: { userId: userId },
    });

    const numberOfPages = Number(orderCount ?? '0') / 10;

    return numberOfPages < 1 ? 1 : Math.ceil(numberOfPages);
  } catch (e) {
    console.error('DatabaseError:', e);
    return 1;
  }
}

export async function fetchOrders(currentPage: number, userId: string) {
  try {
    const limit = 10;
    const offset = (currentPage - 1) * limit;

    const orders = await prisma?.order.findMany({
      where: { userId: userId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });

    if (!orders) {
      return [];
    } else {
      return orders as Order[];
    }
  } catch (e) {
    console.error('DatabaseError:', e);

    return [];
  }
}

export async function fetchSimpleBooksFiltered(
  term: string,
  currentPage: number,
) {
  try {
    if (term.trim().length == 0) {
      return [];
    }

    const offset = (currentPage - 1) * 6;
    const q = `%${term}%`;

    const bookPage = await prisma.$queryRaw<BookSimplifiedRaw[] | null>`
    SELECT      books.id,
                books.title,
                books.price,
                books.type,
                authors.name AS author_name,
                authors.id AS author_id,
                authors.description AS author_description
    FROM        books
    INNER JOIN  authors ON authors.id=books.author_id
    INNER JOIN  publishers ON publishers.id=books.publisher_id
    INNER JOIN  categories ON categories.id=books.category_id
    WHERE       books.title ILIKE ${q} OR
                books.description ILIKE ${q} OR
                authors.name ILIKE ${q} OR
                publishers.name ILIKE ${q} OR
                categories.title ILIKE ${q}
    ORDER BY    books.id ASC
    LIMIT 6     OFFSET ${offset};`;

    if (!bookPage) {
      return [];
    } else {
      return bookPage.map((b) => {
        return {
          id: b.id,
          title: b.title,
          price: b.price,
          type: b.type == 'ELECTRONIC' ? BookType.ELECTRONIC : BookType.PAPER,
          authorId: b.author_id,
          author: {
            id: b.author_id,
            name: b.author_name,
            description: b.author_description,
          } as Author,
        } as BookSimplified;
      });
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}

export async function fetchSimpleFilteredBooksCount(term: string) {
  try {
    const q = `%${term}%`;

    const books = await prisma.$queryRaw<{ count: number | string | null }[]>`
    SELECT      COUNT(*)
    FROM        books
    INNER JOIN  authors ON authors.id=books.author_id
    INNER JOIN  publishers ON publishers.id=books.publisher_id
    INNER JOIN  categories ON categories.id=books.category_id
    WHERE       books.title ILIKE ${q} OR
                books.description ILIKE ${q} OR
                authors.name ILIKE ${q} OR
                publishers.name ILIKE ${q} OR
                categories.title ILIKE ${q};`;

    const numberOfPages = Number(books[0].count ?? '1') / 6;

    if (!isFinite(numberOfPages)) {
      return 1;
    }

    return Math.max(Math.ceil(numberOfPages), 1);
  } catch (e) {
    console.error('DatabaseError:', e);
    return 1;
  }
}

export async function fetchWishedBooks(
  currentPage: number,
  userId: string,
  sortOrder: SortOrder | null,
) {
  try {
    const offset = (currentPage - 1) * 6;

    if (!userId || userId.trim().length == 0) {
      return [];
    }

    const user = await prisma?.user.findUnique({
      where: { id: userId },
      select: { id: true, wishesIds: true },
    });

    if (!user || user?.wishesIds?.length == 0) {
      return [];
    }

    const wishedBooks = await prisma?.book.findMany({
      where: { id: { in: user.wishesIds } },
      take: 6,
      skip: offset,
      select: {
        id: true,
        type: true,
        price: true,
        authorId: true,
        author: true,
        title: true,
      },
      orderBy: getSortOrder(sortOrder),
    });

    if (!wishedBooks) {
      return [];
    } else {
      return wishedBooks as BookSimplified[];
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}

export async function fetchWishedBooksCount(userId: string) {
  try {
    if (!userId || userId.trim().length == 0) {
      return 0;
    }

    const user = await prisma?.user.findUnique({
      where: { id: userId },
      select: { id: true, wishesIds: true },
    });

    const count = user?.wishesIds?.length;
    const numberOfPages = count ? count / 6 : 1;

    return Math.max(Math.ceil(numberOfPages), 1);
  } catch (e) {
    console.error('DatabaseError:', e);

    return 1;
  }
}
