// src/store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Profile = { uid?: string; name?: string; email?: string; photoURL?: string };

const userSlice = createSlice({
  name: "user",
  initialState: { uid: null as string | null, profile: null as Profile | null },
  reducers: {
    setUser(state, action: PayloadAction<{ uid: string; profile: Profile }>) {
      state.uid = action.payload.uid;
      state.profile = action.payload.profile;
    },
    clearUser(state) {
      state.uid = null;
      state.profile = null;
    },
  },
});
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
