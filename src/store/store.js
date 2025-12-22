import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage
import userReducer from "./userSlice";

// 1️⃣ Combine reducers (useful if you add more slices later)
const rootReducer = combineReducers({
  user: userReducer,
});

// 2️⃣ Redux Persist configuration
const persistConfig = {
  key: "root",       // key name in localStorage
  storage,           // defaults to localStorage
  whitelist: ["user"], // persist only the user slice
};

// 3️⃣ Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4️⃣ Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// 5️⃣ Create persistor
export const persistor = persistStore(store);
