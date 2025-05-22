import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage as default storage
import authReducer from './Slice/authstate';
import userReducer from './Slice/userslice';
import postReducer from './Slice/postslice';
import { combineReducers } from 'redux';
import chatReducer from './Slice/chatslice';
import subscriptionReducer from './Slice/subscriptionslice';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  posts: postReducer,
  chat: chatReducer,
  subscription: subscriptionReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root', // Key to store persisted state in localStorage
  storage, // LocalStorage will be used for persistence
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist compatibility
    }),
});

// Persistor for integration (used for persisting the store state)
export const persistor = persistStore(store);

// Types for RootState and AppDispatch for better type checking in the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
