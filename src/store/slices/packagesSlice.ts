import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Package, MemberPackage } from "../../services/packages";

interface PackagesState {
  packages: Package[];
  memberPackages: MemberPackage[];
  selectedPackage: Package | null;
  loading: boolean;
  error: string | null;
}

const packagesSlice = createSlice({
  name: "packages",
  initialState: {
    packages: [],
    memberPackages: [],
    selectedPackage: null,
    loading: false,
    error: null,
  } as PackagesState,
  reducers: {
    setPackages(state, action: PayloadAction<Package[]>) {
      state.packages = action.payload;
    },
    addPackage(state, action: PayloadAction<Package>) {
      state.packages.unshift(action.payload);
    },
    updatePackage(state, action: PayloadAction<Package>) {
      const index = state.packages.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.packages[index] = action.payload;
      }
    },
    removePackage(state, action: PayloadAction<string>) {
      state.packages = state.packages.filter(p => p.id !== action.payload);
    },
    setMemberPackages(state, action: PayloadAction<MemberPackage[]>) {
      state.memberPackages = action.payload;
    },
    addMemberPackage(state, action: PayloadAction<MemberPackage>) {
      state.memberPackages.unshift(action.payload);
    },
    updateMemberPackage(state, action: PayloadAction<MemberPackage>) {
      const index = state.memberPackages.findIndex(mp => mp.id === action.payload.id);
      if (index !== -1) {
        state.memberPackages[index] = action.payload;
      }
    },
    removeMemberPackage(state, action: PayloadAction<string>) {
      state.memberPackages = state.memberPackages.filter(mp => mp.id !== action.payload);
    },
    setSelectedPackage(state, action: PayloadAction<Package | null>) {
      state.selectedPackage = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearPackages(state) {
      state.packages = [];
      state.memberPackages = [];
      state.selectedPackage = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setPackages,
  addPackage,
  updatePackage,
  removePackage,
  setMemberPackages,
  addMemberPackage,
  updateMemberPackage,
  removeMemberPackage,
  setSelectedPackage,
  setLoading,
  setError,
  clearPackages,
} = packagesSlice.actions;

export default packagesSlice.reducer;
