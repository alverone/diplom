import { $Enums, OrderStatus } from '@prisma/client';
import { DefaultSession, ISODateString, User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';

declare global {
  interface Category {
    id: string;
    title: string;
    description: string | null;
  }

  interface Author {
    id: string;
    name: string;
    description: string | null;
  }

  interface Publisher {
    id: string;
    name: string;
    description: string | null;
  }

  declare type BookType = $Enums.BookType;

  interface BookSimplifiedRaw {
    id: string;
    type: string;
    price: number;
    title: string;
    author_name: string;
    author_id: string;
    author_description: string | null;
  }

  interface BookSimplified {
    id: string;
    price: number;
    title: string;
    type: BookType;

    authorId: string;
    author: Author;
  }

  interface Book {
    id: string;
    title: string;
    description: string;
    price: number;
    publishDate: Date;
    pageLength: number;
    type: BookType;

    category: Category;
    categoryId: string;

    author: Author;
    authorId: string;

    publisher: Publisher;
    publisherId: string;
  }

  interface AppUser {
    id: string;
    name: string | null;
    surname: string | null;
    email: string;
    emailVerified: Date | null;
    phone: string | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Order {
    id: number;
    bookIds: string[];
    price: number;
    userId: string;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
  }

  interface AppSessionUser extends User {
    id: string;
  }

  interface AppAdapterUser extends AdapterUser {
    id: string;
    wishesIds?: string[];
  }

  interface AppSession extends DefaultSession {
    user?: AppSessionUser;
    expires: ISODateString;
  }

  interface PaginatedSearchParams {
    searchParams: { page?: string };
  }
}
