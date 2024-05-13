import { configureStore } from '@reduxjs/toolkit';
import { checkoutSlice } from './features/checkout/checkout_slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      checkout: checkoutSlice.reducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
