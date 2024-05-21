import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type BookAndCount = {
  id: string;
  count: number;
};

type CheckoutSliceState = {
  books: BookAndCount[];
};

const initialState: CheckoutSliceState = {
  books: [],
};

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: initialState,
  reducers: {
    addBook: (state, action: PayloadAction<BookAndCount>) => {
      state.books = [...state.books, action.payload];
    },
    incrementBookCount: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;

      state.books = state.books.map((book) =>
        book.id === bookId ? { ...book, count: book.count + 1 } : book,
      );
    },
    decrementBookCount: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const bookCount = state.books.find((book) => book.id === bookId)?.count;

      if (bookCount === 1) {
        state.books = state.books.filter((book) => book.id !== bookId);
      } else {
        state.books = state.books.map((book) =>
          book.id === bookId ? { ...book, count: book.count - 1 } : book,
        );
      }
    },
    removeBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;

      state.books = [...state.books].filter((book) => book.id !== bookId);
    },
  },
});

export const { addBook, incrementBookCount, decrementBookCount, removeBook } =
  checkoutSlice.actions;

export default checkoutSlice.reducer;
