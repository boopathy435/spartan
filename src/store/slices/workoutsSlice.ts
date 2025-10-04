import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Workout, MemberProgress } from "../../services/workouts";

interface WorkoutsState {
  workouts: Workout[];
  selectedWorkout: Workout | null;
  memberProgress: MemberProgress[];
  loading: boolean;
  error: string | null;
}

const workoutsSlice = createSlice({
  name: "workouts",
  initialState: {
    workouts: [],
    selectedWorkout: null,
    memberProgress: [],
    loading: false,
    error: null,
  } as WorkoutsState,
  reducers: {
    setWorkouts(state, action: PayloadAction<Workout[]>) {
      state.workouts = action.payload;
    },
    addWorkout(state, action: PayloadAction<Workout>) {
      state.workouts.unshift(action.payload);
    },
    updateWorkout(state, action: PayloadAction<Workout>) {
      const index = state.workouts.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.workouts[index] = action.payload;
      }
    },
    removeWorkout(state, action: PayloadAction<string>) {
      state.workouts = state.workouts.filter(w => w.id !== action.payload);
    },
    setSelectedWorkout(state, action: PayloadAction<Workout | null>) {
      state.selectedWorkout = action.payload;
    },
    setMemberProgress(state, action: PayloadAction<MemberProgress[]>) {
      state.memberProgress = action.payload;
    },
    addMemberProgress(state, action: PayloadAction<MemberProgress>) {
      state.memberProgress.unshift(action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearWorkouts(state) {
      state.workouts = [];
      state.selectedWorkout = null;
      state.memberProgress = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setWorkouts,
  addWorkout,
  updateWorkout,
  removeWorkout,
  setSelectedWorkout,
  setMemberProgress,
  addMemberProgress,
  setLoading,
  setError,
  clearWorkouts,
} = workoutsSlice.actions;

export default workoutsSlice.reducer;
