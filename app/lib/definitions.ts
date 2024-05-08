import { $Enums } from '@prisma/client';

export interface Category {
  id: string;
  title: string;
  description: string | null;
}

export interface Author {
  id: string;
  name: string;
  description: string | null;
}

export interface Publisher {
  id: string;
  name: string;
  description: string | null;
}

export type BookType = $Enums.BookType;

export interface BookSimplifiedRaw {
  id: string;
  type: string;
  price: number;
  title: string;
  author_name: string;
  author_id: string;
  author_description: string | null;
}

export interface BookSimplified {
  id: string;
  price: number;
  title: string;
  type: BookType;

  authorId: string;
  author: Author;
}

export interface Book {
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

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export { $Enums };
