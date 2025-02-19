import { configureStore ,combineReducers} from "@reduxjs/toolkit";
import counterReducer from "../redux/counter/counterSlice";
import accountReducer from "../redux/account/accountSlice";
import examReducer from "./exam/examSlice";
import examCreatingReducer from "../redux/examCreating/examCreating.Slice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
const rootReducer = combineReducers({
    counter: counterReducer,
    account: accountReducer,
    exam: examReducer,
    examCreating:examCreatingReducer
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export let persistor = persistStore(store);
// export const store = configureStore({
//   reducer: {
//     counter: counterReducer,
//     account: accountReducer,
//     exam: examReducer,
//     examCreating:examCreatingReducer
//   },
// });
