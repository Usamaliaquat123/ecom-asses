import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/auth/authSlice';
import dashboardSlice from './features/dashboard/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    dashboard: dashboardSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


