
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import workoutsReducer from "./slices/workoutsSlice";
import packagesReducer from "./slices/packagesSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    workouts: workoutsReducer,
    packages: packagesReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
