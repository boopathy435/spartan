import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Workout {
  id?: string;
  title: string;
  description: string;
  exercises: Exercise[];
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'strength' | 'cardio' | 'flexibility' | 'mixed';
  createdBy: string; // trainer ID
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number; // in kg
  duration?: number; // in seconds for time-based exercises
  restTime: number; // rest between sets in seconds
  instructions: string;
}

export interface WorkoutPackage {
  id?: string;
  name: string;
  description: string;
  workouts: string[]; // workout IDs
  duration: number; // in weeks
  price: number;
  createdBy: string; // trainer ID
  createdAt: Timestamp;
  isActive: boolean;
}

export interface MemberProgress {
  id?: string;
  memberId: string;
  workoutId: string;
  completedAt: Timestamp;
  notes?: string;
  rating?: number; // 1-5 stars
}

// Workout CRUD operations
export const createWorkout = async (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = Timestamp.now();
    const workoutData = {
      ...workout,
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await addDoc(collection(db, 'workouts'), workoutData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating workout:', error);
    throw error;
  }
};

export const updateWorkout = async (workoutId: string, updates: Partial<Workout>): Promise<void> => {
  try {
    const workoutRef = doc(db, 'workouts', workoutId);
    await updateDoc(workoutRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
};

export const deleteWorkout = async (workoutId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'workouts', workoutId));
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
};

export const getWorkout = async (workoutId: string): Promise<Workout | null> => {
  try {
    const workoutDoc = await getDoc(doc(db, 'workouts', workoutId));
    if (workoutDoc.exists()) {
      return { id: workoutDoc.id, ...workoutDoc.data() } as Workout;
    }
    return null;
  } catch (error) {
    console.error('Error fetching workout:', error);
    throw error;
  }
};

export const getWorkoutsByTrainer = async (trainerId: string): Promise<Workout[]> => {
  try {
    const workoutsQuery = query(
      collection(db, 'workouts'),
      where('createdBy', '==', trainerId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(workoutsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workout));
  } catch (error) {
    console.error('Error fetching trainer workouts:', error);
    throw error;
  }
};

export const getAllWorkouts = async (): Promise<Workout[]> => {
  try {
    const workoutsQuery = query(
      collection(db, 'workouts'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(workoutsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workout));
  } catch (error) {
    console.error('Error fetching all workouts:', error);
    throw error;
  }
};

// Workout Package operations
export const createWorkoutPackage = async (packageData: Omit<WorkoutPackage, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const now = Timestamp.now();
    const packageDoc = {
      ...packageData,
      createdAt: now,
    };
    
    const docRef = await addDoc(collection(db, 'workoutPackages'), packageDoc);
    return docRef.id;
  } catch (error) {
    console.error('Error creating workout package:', error);
    throw error;
  }
};

export const getWorkoutPackagesByTrainer = async (trainerId: string): Promise<WorkoutPackage[]> => {
  try {
    const packagesQuery = query(
      collection(db, 'workoutPackages'),
      where('createdBy', '==', trainerId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(packagesQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutPackage));
  } catch (error) {
    console.error('Error fetching trainer packages:', error);
    throw error;
  }
};

export const getAllWorkoutPackages = async (): Promise<WorkoutPackage[]> => {
  try {
    const packagesQuery = query(
      collection(db, 'workoutPackages'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(packagesQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutPackage));
  } catch (error) {
    console.error('Error fetching workout packages:', error);
    throw error;
  }
};

// Member Progress operations
export const logWorkoutProgress = async (progress: Omit<MemberProgress, 'id'>): Promise<string> => {
  try {
    const progressData = {
      ...progress,
      completedAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(collection(db, 'memberProgress'), progressData);
    return docRef.id;
  } catch (error) {
    console.error('Error logging workout progress:', error);
    throw error;
  }
};

export const getMemberProgress = async (memberId: string): Promise<MemberProgress[]> => {
  try {
    const progressQuery = query(
      collection(db, 'memberProgress'),
      where('memberId', '==', memberId),
      orderBy('completedAt', 'desc')
    );
    
    const snapshot = await getDocs(progressQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MemberProgress));
  } catch (error) {
    console.error('Error fetching member progress:', error);
    throw error;
  }
};

export const getWorkoutProgress = async (workoutId: string): Promise<MemberProgress[]> => {
  try {
    const progressQuery = query(
      collection(db, 'memberProgress'),
      where('workoutId', '==', workoutId),
      orderBy('completedAt', 'desc')
    );
    
    const snapshot = await getDocs(progressQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MemberProgress));
  } catch (error) {
    console.error('Error fetching workout progress:', error);
    throw error;
  }
};
