import { Prisma } from '@prisma/client';
import prisma from './prisma';
import { calculateTotalPages, getSortOrder } from './utils';

export enum SortOrder {
  PriceAsc = 'price_asc',
  PriceDesc = 'price_desc',
  TitleAsc = 'title_asc',
  TitleDesc = 'title_desc',
  Time = 'time',
}

export enum CatalogBookLimit {
  DEFAULT = 6,
  ADMIN = 10,
}

/* authors */

export async function getAllAuthors(): Promise<Author[]> {
  try {
    return await prisma?.author.findMany();
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}

export async function getPaginatedAuthorsWithCount(
  currentPage: number,
  sortOrder: SortOrder | null,
  limit?: CatalogBookLimit | null,
): Promise<PaginatedDataResponse<Author>> {
  try {
    const _limit = (limit ?? CatalogBookLimit.DEFAULT).valueOf();
    const offset = (currentPage - 1) * _limit;

    const [authorPage, count] = await prisma?.$transaction([
      prisma?.author.findMany({
        take: _limit,
        skip: offset,
        orderBy: getSortOrder(sortOrder),
      }),
      prisma?.author.count(),
    ]);
    const totalPages = calculateTotalPages(_limit, count);

    return { data: authorPage, count: totalPages };
  } catch (e) {
    console.error('DatabaseError:', e);
    return { data: [], count: 1 };
  }
}

export async function getAuthorDetails(id: string) {
  try {
    return await prisma?.author.findUnique({
      where: { id: id },
    });
  } catch (e) {
    console.error('DatabaseError:', e);
    return null;
  }
}

/* end authors */

/* publishers */

export async function getAllPublishers(): Promise<Publisher[]> {
  try {
    return await prisma?.publisher.findMany();
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}

export async function getPaginatedPublishersWithCount(
  currentPage: number,
  sortOrder: SortOrder | null,
  limit?: CatalogBookLimit | null,
): Promise<PaginatedDataResponse<Publisher>> {
  try {
    const _limit = (limit ?? CatalogBookLimit.DEFAULT).valueOf();
    const offset = (currentPage - 1) * _limit;

    const [publisherPage, count] = await prisma?.$transaction([
      prisma?.publisher.findMany({
        take: _limit,
        skip: offset,
        orderBy: getSortOrder(sortOrder),
      }),
      prisma?.publisher.count(),
    ]);
    const totalPages = calculateTotalPages(_limit, count);

    return { data: publisherPage, count: totalPages };
  } catch (e) {
    console.error('DatabaseError:', e);
    return { data: [], count: 1 };
  }
}

export async function getPublisherDetails(
  id: string,
): Promise<Publisher | null> {
  try {
    return await prisma?.publisher.findUnique({
      where: { id: id },
    });
  } catch (e) {
    console.error('DatabaseError:', e);
    return null;
  }
}

/* end publishers */

/* categories */

export async function getAllCategories(): Promise<Category[]> {
  try {
    return await prisma?.category.findMany();
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}

export async function getPaginatedCategoriesWithCount(
  currentPage: number,
  sortOrder: SortOrder | null,
  limit?: CatalogBookLimit | null,
): Promise<PaginatedDataResponse<Category>> {
  try {
    const _limit = (limit ?? CatalogBookLimit.DEFAULT).valueOf();
    const offset = (currentPage - 1) * _limit;

    const [categoryPage, count] = await prisma?.$transaction([
      prisma?.category.findMany({
        take: _limit,
        skip: offset,
        orderBy: getSortOrder(sortOrder),
      }),
      prisma?.category.count(),
    ]);
    const totalPages = calculateTotalPages(_limit, count);

    return { data: categoryPage, count: totalPages };
  } catch (e) {
    console.error('DatabaseError:', e);
    return { data: [], count: 1 };
  }
}

export async function getCategoryDetails(id: string): Promise<Category | null> {
  try {
    return await prisma?.category.findUnique({
      where: { id: id },
    });
  } catch (e) {
    console.error('DatabaseError:', e);
    return null;
  }
}

/* end categories */

/* books */

export async function fetchSimpleBooksPaginatedWithCount(
  currentPage: number,
  sortOrder: SortOrder | null,
  limit?: CatalogBookLimit | null,
  filterInput?: SimpleBooksFilterInput,
): Promise<PaginatedDataResponse<BookSimplified>> {
  try {
    const _limit = (limit ?? CatalogBookLimit.DEFAULT).valueOf();
    const offset = (currentPage - 1) * _limit;
    const { authorId, publisherId, categoryId } = filterInput ?? {};

    const [bookPage, count] = await prisma?.$transaction([
      prisma?.book.findMany({
        take: _limit,
        skip: offset,
        where: {
          publisherId: publisherId,
          categoryId: categoryId,
          authorId: authorId,
        },
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
      }),
      prisma?.book.count({
        where: {
          publisherId: publisherId,
          categoryId: categoryId,
          authorId: authorId,
        },
      }),
    ]);
    const totalPages = calculateTotalPages(_limit, count);

    return { data: bookPage, count: totalPages };
  } catch (e) {
    console.error('DatabaseError:', e);
    return { data: [], count: 1 };
  }
}

export async function getBookDetails(id: string): Promise<Book | null> {
  try {
    return await prisma?.book.findUnique({
      where: { id: id },
      include: {
        publisher: true,
        author: true,
        category: true,
      },
    });
  } catch (e) {
    console.error('DatabaseError:', e);
    return null;
  }
}

/* end books */

/* orders */

export async function getPaginatedOrdersWithCount(
  currentPage: number,
  userId?: string,
): Promise<PaginatedDataResponse<Order>> {
  try {
    const limit = CatalogBookLimit.ADMIN.valueOf();
    const offset = (currentPage - 1) * limit;

    const [ordersPage, count] = await prisma?.$transaction([
      prisma?.order.findMany({
        where: { userId: userId },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma?.order.count({
        where: { userId: userId },
      }),
    ]);
    const totalPages = calculateTotalPages(limit, count);

    return { data: ordersPage, count: totalPages };
  } catch (e) {
    console.error('DatabaseError:', e);

    return { data: [], count: 1 };
  }
}

/* end orders */

/* search */

export async function getPaginatedFilteredSimpleBooks(
  term: string,
  currentPage: number,
  sortOrder: SortOrder | null,
  limit?: CatalogBookLimit | null,
): Promise<PaginatedDataResponse<BookSimplified>> {
  try {
    if (term.trim().length == 0) {
      return { data: [], count: 1 };
    }

    const _limit = (limit ?? CatalogBookLimit.DEFAULT).valueOf();
    const offset = (currentPage - 1) * _limit;

    const orFilters = [
      {
        title: {
          contains: term,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: term,
          mode: 'insensitive',
        },
      },
      {
        author: {
          name: {
            contains: term,
            mode: 'insensitive',
          },
        },
      },
      {
        category: {
          title: {
            contains: term,
            mode: 'insensitive',
          },
        },
      },
      {
        publisher: {
          name: {
            contains: term,
            mode: 'insensitive',
          },
        },
      },
    ];

    const [bookPage, count] = await prisma?.$transaction([
      prisma?.book.findMany({
        take: _limit,
        skip: offset,
        where: {
          OR: orFilters as Prisma.BookWhereInput[],
        },
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
      }),
      prisma?.book.count({
        where: {
          OR: orFilters as Prisma.BookWhereInput[],
        },
      }),
    ]);
    const totalPages = calculateTotalPages(_limit, count);

    return { data: bookPage, count: totalPages };
  } catch (e) {
    console.error('DatabaseError:', e);
    return { data: [], count: 1 };
  }
}

/* end search */

/* wishlist */

export async function getUserWishedBooks(
  currentPage: number,
  userId: string,
  sortOrder: SortOrder | null,
  limit?: CatalogBookLimit | null,
): Promise<PaginatedDataResponse<BookSimplified>> {
  try {
    const _limit = (limit ?? CatalogBookLimit.DEFAULT).valueOf();
    const offset = (currentPage - 1) * _limit;

    if (!userId || userId.trim().length == 0) {
      return { data: [], count: 1 };
    }

    const user = await prisma?.user.findUnique({
      where: { id: userId },
      select: { id: true, wishesIds: true },
    });

    if (!user || user?.wishesIds?.length == 0) {
      return { data: [], count: 1 };
    }

    const [wishedBooksPage, count] = await prisma.$transaction([
      prisma?.book.findMany({
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
      }),
      prisma.book.count({
        where: { id: { in: user.wishesIds } },
      }),
    ]);
    const pageCount = calculateTotalPages(_limit, count);

    return { data: wishedBooksPage, count: pageCount };
  } catch (e) {
    console.error('DatabaseError:', e);
    return { data: [], count: 1 };
  }
}

/* end wishlist */
