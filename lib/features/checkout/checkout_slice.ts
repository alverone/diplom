import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CheckoutSliceState = {
  books: string[];
};

const initialState: CheckoutSliceState = {
  books: [],
};

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: initialState,
  reducers: {
    addBook: (state, action: PayloadAction<string>) => {
      state.books = [...state.books, action.payload];
    },
    removeBook: (state, action) => {
      state.books = state.books.filter((book) => book !== action.payload);
    },
  },
});

export const { addBook, removeBook } = checkoutSlice.actions;

export default checkoutSlice.reducer;
