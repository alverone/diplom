import { $Enums, OrderStatus, UserRole } from '@prisma/client';
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
    coverUrl: string | null;
    author_name: string;
    author_id: string;
    author_description: string | null;
  }

  interface BookSimplified {
    id: string;
    price: number;
    title: string;
    type: BookType;
    coverUrl: string | null;
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
    coverUrl: string | null;

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
    userId: string | null;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    fullName: string | null;
    phone: string | null;
    address: string | null;
    description: string | null;
    email: string | null;
  }

  interface AppSessionUser extends User {
    id: string;
    surname: string | null;
    phone: string | null;
    role: UserRole;
  }

  interface AppAdapterUser extends AdapterUser {
    id: string;
    phone: string | null;
    surname: string | null;
    role: UserRole;
  }

  interface AppSession extends DefaultSession {
    user?: AppSessionUser;
    expires: ISODateString;
  }

  interface PaginatedSearchParams {
    searchParams: { page?: string; sortOrder?: string };
  }

  type BookAndCount = {
    id: string;
    coverUrl: string | null;
    count: number;
  };

  type PaginatedDataResponse<T> = {
    data: T[];
    count: number;
  };

  type SimpleBooksFilterInput = {
    authorId?: string;
    publisherId?: string;
    categoryId?: string;
  };

  interface FormErrors {
    email?: string[] | undefined;
    password?: string[] | undefined;
    phone?: string[] | undefined;
    name?: string[] | undefined;
    surname?: string[] | undefined;
    address?: string[] | undefined;
    title?: string[] | undefined;
    id?: string[] | undefined;
    price?: string[] | undefined;
    description?: string[] | undefined;
    status?: string[] | undefined;
    userId?: string[] | undefined;
    fullName?: string[] | undefined;
    pageLength?: string[] | undefined;
    cover?: string[] | undefined;
    authorId?: string[] | undefined;
    publishDate?: string[] | undefined;
    type?: string[] | undefined;
  }
}
