import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "./Slice/userData";
export default configureStore({
  reducer: {
    userData: userDataReducer,
  },
});
