import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ModalSliceState = {
  displayed: boolean;
};

const initialState: ModalSliceState = {
  displayed: false,
};

export const modalSlice = createSlice({
  name: 'drawers',
  initialState: initialState,
  reducers: {
    toggleModal: (state, action: PayloadAction<boolean>) => {
      state.displayed = action.payload;
    },
  },
});

export const { toggleModal } = modalSlice.actions;

export default modalSlice.reducer;
