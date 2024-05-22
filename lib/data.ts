import { BookType } from '@prisma/client';
import prisma from './prisma';

export enum SortOrder {
  PriceAsc = 'price_asc',
  PriceDesc = 'price_desc',
  TitleAsc = 'title_asc',
  TitleDesc = 'title_desc',
  Time = 'time',
}

export enum CatalogBookLimit {
  Default = 6,
  Admin = 10,
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

export async function fetchAuthorsPaginated(
  currentPage: number,
  sortOrder: SortOrder | null,
  limit?: CatalogBookLimit | null,
) {
  try {
    const _limit = (limit ?? CatalogBookLimit.Default).valueOf();
    const offset = (currentPage - 1) * _limit;

    const authorPage = await prisma?.author.findMany({
      take: _limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: getSortOrder(sortOrder),
    });

    if (!authorPage) {
      return [];
    } else {
      return authorPage as Author[];
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

export async function fetchPublishersPaginated(
  currentPage: number,
  sortOrder: SortOrder | null,
  limit?: CatalogBookLimit | null,
) {
  try {
    const _limit = (limit ?? CatalogBookLimit.Default).valueOf();
    const offset = (currentPage - 1) * _limit;

    const publisherPage = await prisma?.publisher.findMany({
      take: _limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: getSortOrder(sortOrder),
    });

    if (!publisherPage) {
      return [];
    } else {
      return publisherPage as Publisher[];
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
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

export async function fetchCategoriesPaginated(
  currentPage: number,
  sortOrder: SortOrder | null,
  limit?: CatalogBookLimit | null,
) {
  try {
    const _limit = (limit ?? CatalogBookLimit.Default).valueOf();
    const offset = (currentPage - 1) * _limit;

    const categoryPage = await prisma?.category.findMany({
      take: _limit,
      skip: offset,
      select: {
        id: true,
        title: true,
        description: true,
      },
      orderBy: getSortOrder(sortOrder),
    });

    if (!categoryPage) {
      return [];
    } else {
      return categoryPage as Category[];
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}

export async function fetchSimpleBooks(
  currentPage: number,
  sortOrder: SortOrder | null,
  limit?: CatalogBookLimit | null,
) {
  try {
    const _limit = (limit ?? CatalogBookLimit.Default).valueOf();
    const offset = (currentPage - 1) * _limit;

    const bookPage = await prisma?.book.findMany({
      take: _limit,
      skip: offset,
      select: {
        id: true,
        type: true,
        price: true,
        coverUrl: true,
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
  limit?: CatalogBookLimit | null,
) {
  try {
    const _limit = (limit ?? CatalogBookLimit.Default).valueOf();
    const offset = (currentPage - 1) * _limit;

    const bookPage = await prisma?.book.findMany({
      where: {
        authorId: authorId,
      },
      take: _limit,
      skip: offset,
      select: {
        id: true,
        type: true,
        price: true,
        coverUrl: true,
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
  limit?: CatalogBookLimit | null,
) {
  try {
    const _limit = (limit ?? CatalogBookLimit.Default).valueOf();
    const offset = (currentPage - 1) * _limit;

    const bookPage = await prisma?.book.findMany({
      where: {
        publisherId: publisherId,
      },
      take: _limit,
      skip: offset,
      select: {
        id: true,
        type: true,
        price: true,
        coverUrl: true,
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
  limit?: CatalogBookLimit | null,
) {
  try {
    const _limit = (limit ?? CatalogBookLimit.Default).valueOf();
    const offset = (currentPage - 1) * _limit;

    const bookPage = await prisma?.book.findMany({
      where: {
        categoryId: categoryId,
      },
      take: _limit,
      skip: offset,
      select: {
        id: true,
        type: true,
        price: true,
        coverUrl: true,
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

export async function fetchSimpleBooksCountByAuthor(
  authorId: string,
  limit?: CatalogBookLimit | null,
) {
  try {
    const _limit = (limit ?? CatalogBookLimit.Default).valueOf();
    const authorBooks = await prisma?.book.count({
      where: { authorId: authorId },
    });

    const numberOfPages = authorBooks ? authorBooks / _limit : 1;

    return Math.max(Math.ceil(numberOfPages), 1);
  } catch (e) {
    console.error('DatabaseError:', e);
    return 1;
  }
}

export async function fetchSimpleBooksCountByPublisher(
  publisherId: string,
  limit?: CatalogBookLimit | null,
) {
  const _limit = (limit ?? CatalogBookLimit.Default).valueOf();
  try {
    const publisherBooks = await prisma?.book.count({
      where: { publisherId: publisherId },
    });

    const numberOfPages = publisherBooks ? publisherBooks / _limit : 1;

    return Math.max(Math.ceil(numberOfPages), 1);
  } catch (e) {
    console.error('DatabaseError:', e);
    return 1;
  }
}

export async function fetchSimpleBooksCountByCategory(
  categoryId: string,
  limit?: CatalogBookLimit | null,
): Promise<number> {
  try {
    const _limit = (limit ?? CatalogBookLimit.Default).valueOf();
    const categoryBooks = await prisma?.book.count({
      where: {
        categoryId: categoryId,
      },
    });

    const numberOfPages = categoryBooks ? categoryBooks / _limit : 1;

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

export async function fetchBookPagesCount(limit?: CatalogBookLimit | null) {
  try {
    const _limit = (limit ?? CatalogBookLimit.Default).valueOf();
    const bookCount = await prisma?.book.count();

    const numberOfPages = Number(bookCount ?? '0') / _limit;

    return numberOfPages < 1 ? 1 : Math.ceil(numberOfPages);
  } catch (e) {
    console.error('DatabaseError:', e);
    return 1;
  }
}

export async function fetchAuthorsCount(limit?: CatalogBookLimit | null) {
  try {
    const _limit = (limit ?? CatalogBookLimit.Default).valueOf();
    const authorCount = await prisma?.author.count();

    const numberOfPages = Number(authorCount ?? '0') / _limit;

    return numberOfPages < 1 ? 1 : Math.ceil(numberOfPages);
  } catch (e) {
    console.error('DatabaseError:', e);
    return 1;
  }
}

export async function fetchCategoriesCount(limit?: CatalogBookLimit | null) {
  try {
    const _limit = (limit ?? CatalogBookLimit.Default).valueOf();
    const categoryCount = await prisma?.category.count();

    const numberOfPages = Number(categoryCount ?? '0') / _limit;

    return numberOfPages < 1 ? 1 : Math.ceil(numberOfPages);
  } catch (e) {
    console.error('DatabaseError:', e);
    return 1;
  }
}

export async function fetchPublishersCount(limit?: CatalogBookLimit | null) {
  try {
    const _limit = (limit ?? CatalogBookLimit.Default).valueOf();
    const publisherCount = await prisma?.publisher.count();

    const numberOfPages = Number(publisherCount ?? '0') / _limit;

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
  limit?: CatalogBookLimit | null,
) {
  try {
    if (term.trim().length == 0) {
      return [];
    }

    const _limit = (limit ?? CatalogBookLimit.Default).valueOf();
    const offset = (currentPage - 1) * _limit;
    const q = `%${term}%`;

    const bookPage = await prisma.$queryRaw<BookSimplifiedRaw[] | null>`
    SELECT      books.id,
                books.title,
                books.price,
                books.type,
                books.coverUrl,
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
    LIMIT ${_limit}     OFFSET ${offset};`;

    if (!bookPage) {
      return [];
    } else {
      return bookPage.map((b) => {
        return {
          id: b.id,
          title: b.title,
          price: b.price,
          type: b.type == 'ELECTRONIC' ? BookType.ELECTRONIC : BookType.PAPER,
          coverUrl: b.coverUrl ?? null,
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

export async function fetchSimpleFilteredBooksCount(
  term: string,
  limit?: CatalogBookLimit | null,
) {
  try {
    const _limit = (limit ?? CatalogBookLimit.Default).valueOf();
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

    const numberOfPages = Number(books[0].count ?? '1') / _limit;

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
  limit?: CatalogBookLimit | null,
) {
  try {
    const _limit = (limit ?? CatalogBookLimit.Default).valueOf();
    const offset = (currentPage - 1) * _limit;

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
      take: _limit,
      skip: offset,
      select: {
        id: true,
        type: true,
        price: true,
        coverUrl: true,
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

export async function fetchWishedBooksCount(
  userId: string,
  limit?: CatalogBookLimit | null,
) {
  try {
    if (!userId || userId.trim().length == 0) {
      return 0;
    }

    const _limit = (limit ?? CatalogBookLimit.Default).valueOf();
    const user = await prisma?.user.findUnique({
      where: { id: userId },
      select: { id: true, wishesIds: true },
    });

    const count = user?.wishesIds?.length;
    const numberOfPages = count ? count / _limit : 1;

    return Math.max(Math.ceil(numberOfPages), 1);
  } catch (e) {
    console.error('DatabaseError:', e);

    return 1;
  }
}

export type BookPayload = {
  title?: string;
  description?: string;
  price?: number;
  pageLength?: number;
  type?: BookType;
  coverUrl?: string;
  authorId?: string;
  publisherId?: string;
  categoryId?: string;
};

export async function updateBook(bookId: string, payload: BookPayload) {
  try {
    const updatedBook = await prisma?.book.update({
      where: { id: bookId },
      data: {
        title: {
          set: payload.title,
        },
        description: {
          set: payload.title,
        },
        price: {
          set: payload.price,
        },
        pageLength: {
          set: payload.pageLength,
        },
        type: {
          set: payload.type,
        },
        coverUrl: {
          set: payload.coverUrl,
        },
        authorId: {
          set: payload.authorId,
        },
        publisherId: {
          set: payload.publisherId,
        },
        categoryId: {
          set: payload.categoryId,
        },
      },
    });

    if (!updatedBook) {
      return null;
    } else {
      return updatedBook as Book;
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return null;
  }
}

/*export async function createBook(payload: BookPayload) {
  try {
    const newBook = await prisma?.book.create({
      data: {
        title: payload.title,
        description: payload.description,
        price: payload.price,
        pageLength: payload.pageLength,
        type: payload.type,
        coverUrl: payload.coverUrl,
        authorId: payload.authorId,
        publisherId: payload.publisherId,
        categoryId: payload.categoryId,
      },
    });

    if (!newBook) {
      return null;
    } else {
      return newBook as Book;
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return null;
  }
}*/
