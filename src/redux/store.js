import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../redux/counter/counterSlice";
import accountReducer from "../redux/account/accountSlice";
import examReducer from "./exam/examSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    account: accountReducer,
    exam: examReducer,
  },
});
