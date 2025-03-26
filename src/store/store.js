import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import registrationReducer from './registrationSlice';
import articleReducer from './articleSlice';
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    registration: registrationReducer,
    article: articleReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});
