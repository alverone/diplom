import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type DrawersSliceState = {
  cartOpen: boolean;
  navOpen: boolean;
};

const initialState: DrawersSliceState = {
  cartOpen: false,
  navOpen: false,
};

export const drawersSlice = createSlice({
  name: 'drawers',
  initialState: initialState,
  reducers: {
    toggleCart: (state, action: PayloadAction<boolean>) => {
      state.cartOpen = action.payload;
    },
    toggleNav: (state, action: PayloadAction<boolean>) => {
      state.navOpen = action.payload;
    },
  },
});

export const { toggleCart, toggleNav } = drawersSlice.actions;

export default drawersSlice.reducer;
