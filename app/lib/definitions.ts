export interface Category {
  id: string;
  title: string;
  description?: string;
}

export interface Author {
  id: string;
  name: string;
  description?: string;
}

export interface Publisher {
  id: string;
  name: string;
  description?: string;
}

export enum BookType {
  Electronic = 'electronic',
  Paper = 'paper',
}

export interface BookRaw {
  id: string;
  title: string;
  description: string;
  price: number;
  publish_date: Date;
  page_length: number;
  type: string;
  imageUrl?: string;
  author: string;
  publisher: string;
  category: string;
}

export interface BookSimplifiedRaw {
  id: string;
  type: string;
  price: number;
  author_name: string;
  author_id: string;
  title: string;
}

export interface BookSimplified {
  id: string;
  type: BookType;
  price: number;
  author: Author;
  title: string;
}

export interface Book {
  id: string;
  title: string;
  category: Category;
  description: string;
  price: number;
  author: Author;
  publisher: Publisher;
  publish_date: Date;
  page_length: number;
  type: BookType;
  imageUrl?: string;
}

export interface BookPayload {
  title: string;
  description: string;
  price: number;
  publish_date: Date;
  page_length: number;
  type: string;
  imageUrl?: string;
  author_name: string;
  publisher_name: string;
  category_title: string;
}
