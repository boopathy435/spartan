import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRole, UserData } from "../../services/auth";

type Profile = { uid?: string; name?: string; email?: string; photoURL?: string };

interface UserState {
  uid: string | null;
  profile: Profile | null;
  role: UserRole | null;
  trainerId?: string;
  assignedPackageId?: string;
  members?: UserData[]; // For trainers
  assignedPackage?: any; // For members
}

const userSlice = createSlice({
  name: "user",
  initialState: { 
    uid: null as string | null, 
    profile: null as Profile | null,
    role: null as UserRole | null,
    trainerId: undefined as string | undefined,
    assignedPackageId: undefined as string | undefined,
    members: undefined as UserData[] | undefined,
    assignedPackage: undefined as any,
  },
  reducers: {
    setUser(state, action: PayloadAction<{ uid: string; profile: Profile; role: UserRole }>) {
      state.uid = action.payload.uid;
      state.profile = action.payload.profile;
      state.role = action.payload.role;
    },
    setRole(state, action: PayloadAction<UserRole>) {
      state.role = action.payload;
    },
    updateProfile(state, action: PayloadAction<Partial<Profile>>) {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    updateRole(state, action: PayloadAction<UserRole>) {
      state.role = action.payload;
    },
    setTrainerId(state, action: PayloadAction<string>) {
      state.trainerId = action.payload;
    },
    setAssignedPackageId(state, action: PayloadAction<string>) {
      state.assignedPackageId = action.payload;
    },
    setMembers(state, action: PayloadAction<UserData[]>) {
      state.members = action.payload;
    },
    setAssignedPackage(state, action: PayloadAction<any>) {
      state.assignedPackage = action.payload;
    },
    clearUser(state) {
      state.uid = null;
      state.profile = null;
      state.role = null;
      state.trainerId = undefined;
      state.assignedPackageId = undefined;
      state.members = undefined;
      state.assignedPackage = undefined;
    },
  },
});
export const { 
  setUser, 
  setRole, 
  updateProfile, 
  updateRole, 
  setTrainerId, 
  setAssignedPackageId, 
  setMembers, 
  setAssignedPackage, 
  clearUser 
} = userSlice.actions;
export default userSlice.reducer;
