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

export interface Package {
  id?: string;
  name: string;
  description: string;
  duration: number; // in weeks
  price: number;
  features: string[];
  createdBy: string; // trainer/admin ID
  createdAt: Timestamp;
  isActive: boolean;
}

export interface MemberPackage {
  id?: string;
  memberId: string;
  packageId: string;
  trainerId: string;
  assignedAt: Timestamp;
  expiresAt: Timestamp;
  isActive: boolean;
}

export interface PackageAssignment {
  memberId: string;
  packageId: string;
  trainerId: string;
  duration: number; // in weeks
}

// Package CRUD operations
export const createPackage = async (packageData: Omit<Package, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const now = Timestamp.now();
    const packageDoc = {
      ...packageData,
      createdAt: now,
    };
    
    const docRef = await addDoc(collection(db, 'packages'), packageDoc);
    return docRef.id;
  } catch (error) {
    console.error('Error creating package:', error);
    throw error;
  }
};

export const updatePackage = async (packageId: string, updates: Partial<Package>): Promise<void> => {
  try {
    const packageRef = doc(db, 'packages', packageId);
    await updateDoc(packageRef, {
      ...updates,
      isActive: updates.isActive !== undefined ? updates.isActive : true,
    });
  } catch (error) {
    console.error('Error updating package:', error);
    throw error;
  }
};

export const deletePackage = async (packageId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'packages', packageId));
  } catch (error) {
    console.error('Error deleting package:', error);
    throw error;
  }
};

export const getPackage = async (packageId: string): Promise<Package | null> => {
  try {
    const packageDoc = await getDoc(doc(db, 'packages', packageId));
    if (packageDoc.exists()) {
      return { id: packageDoc.id, ...packageDoc.data() } as Package;
    }
    return null;
  } catch (error) {
    console.error('Error fetching package:', error);
    throw error;
  }
};

export const getAllPackages = async (): Promise<Package[]> => {
  try {
    const packagesQuery = query(
      collection(db, 'packages'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(packagesQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
};

export const getPackagesByTrainer = async (trainerId: string): Promise<Package[]> => {
  try {
    const packagesQuery = query(
      collection(db, 'packages'),
      where('createdBy', '==', trainerId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(packagesQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
  } catch (error) {
    console.error('Error fetching trainer packages:', error);
    throw error;
  }
};

// Member Package Assignment operations
export const assignPackageToMember = async (assignment: PackageAssignment): Promise<string> => {
  try {
    const now = Timestamp.now();
    const expiresAt = new Timestamp(
      now.seconds + (assignment.duration * 7 * 24 * 60 * 60), // weeks to seconds
      0
    );
    
    const memberPackage: Omit<MemberPackage, 'id'> = {
      memberId: assignment.memberId,
      packageId: assignment.packageId,
      trainerId: assignment.trainerId,
      assignedAt: now,
      expiresAt,
      isActive: true,
    };
    
    const docRef = await addDoc(collection(db, 'memberPackages'), memberPackage);
    return docRef.id;
  } catch (error) {
    console.error('Error assigning package to member:', error);
    throw error;
  }
};

export const getMemberPackages = async (memberId: string): Promise<MemberPackage[]> => {
  try {
    const memberPackagesQuery = query(
      collection(db, 'memberPackages'),
      where('memberId', '==', memberId),
      where('isActive', '==', true),
      orderBy('assignedAt', 'desc')
    );
    
    const snapshot = await getDocs(memberPackagesQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MemberPackage));
  } catch (error) {
    console.error('Error fetching member packages:', error);
    throw error;
  }
};

export const getMembersByTrainer = async (trainerId: string): Promise<MemberPackage[]> => {
  try {
    const membersQuery = query(
      collection(db, 'memberPackages'),
      where('trainerId', '==', trainerId),
      where('isActive', '==', true),
      orderBy('assignedAt', 'desc')
    );
    
    const snapshot = await getDocs(membersQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MemberPackage));
  } catch (error) {
    console.error('Error fetching trainer members:', error);
    throw error;
  }
};

export const updateMemberPackage = async (memberPackageId: string, updates: Partial<MemberPackage>): Promise<void> => {
  try {
    const memberPackageRef = doc(db, 'memberPackages', memberPackageId);
    await updateDoc(memberPackageRef, updates);
  } catch (error) {
    console.error('Error updating member package:', error);
    throw error;
  }
};

export const deactivateMemberPackage = async (memberPackageId: string): Promise<void> => {
  try {
    await updateMemberPackage(memberPackageId, { isActive: false });
  } catch (error) {
    console.error('Error deactivating member package:', error);
    throw error;
  }
};

// Utility functions
export const isPackageExpired = (expiresAt: Timestamp): boolean => {
  return expiresAt.toDate() < new Date();
};

export const getDaysUntilExpiry = (expiresAt: Timestamp): number => {
  const now = new Date();
  const expiryDate = expiresAt.toDate();
  const diffTime = expiryDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
