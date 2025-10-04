import * as Facebook from "expo-auth-session/providers/facebook";
import * as Google from "expo-auth-session/providers/google";
import { createUserWithEmailAndPassword, FacebookAuthProvider, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile, User } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as FileSystem from 'expo-file-system';
import React from "react";
import { auth, db, storage } from "../config/firebase";

export type UserRole = "admin" | "trainer" | "member";

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  trainerId?: string; // For members assigned to trainers
  assignedPackageId?: string; // For members with assigned packages
}

export const loginWithEmail = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
            return userDoc.data() as UserData;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};

export const registerWithEmail = async (email: string, password: string, displayName?: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create user document in Firestore with default role "member"
        const userData: UserData = {
            uid: user.uid,
            email: user.email!,
            displayName: displayName || user.displayName || "",
            role: "member"
        };
        
        await setDoc(doc(db, "users", user.uid), userData);
        
        return user;
    } catch (error) {
        throw error;
    }
};


export const logout = async () => {
    await signOut(auth);
};

export const resetPassword = async (email: string) => {
    try {
        console.log("Attempting to send password reset email to:", email);
        console.log("Auth instance:", auth);
        console.log("Auth domain:", auth.config.authDomain);
        
        // Send password reset email - Firebase will handle user existence check
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent successfully");
        return true;
    } catch (error: any) {
        console.error("Error sending password reset email:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        
        // Handle specific error cases
        if (error.code === 'auth/user-not-found') {
            throw new Error("No account found with this email address. Please check your email or create a new account.");
        } else if (error.code === 'auth/invalid-email') {
            throw new Error("Please enter a valid email address.");
        } else if (error.code === 'auth/too-many-requests') {
            throw new Error("Too many reset attempts. Please try again later.");
        } else if (error.code === 'auth/network-request-failed') {
            throw new Error("Network error. Please check your internet connection and try again.");
        } else {
            throw new Error(error.message || "Failed to send reset email. Please try again.");
        }
    }
};

export const updateUserProfile = async (displayName?: string, photoURL?: string, email?: string) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("No user is currently signed in");
        }

        const updates: { displayName?: string; photoURL?: string } = {};
        
        if (displayName !== undefined) {
            updates.displayName = displayName;
        }
        
        if (photoURL !== undefined) {
            updates.photoURL = photoURL;
        }

        // Update Firebase Auth profile
        if (Object.keys(updates).length > 0) {
            await updateProfile(user, updates);
        }

        // Update Firestore user document
        const firestoreUpdates: any = {};
        if (displayName !== undefined) {
            firestoreUpdates.displayName = displayName;
        }
        if (photoURL !== undefined) {
            firestoreUpdates.photoURL = photoURL;
        }

        if (Object.keys(firestoreUpdates).length > 0) {
            await updateDoc(doc(db, "users", user.uid), firestoreUpdates);
        }

        return user;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

export const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
        await updateDoc(doc(db, "users", userId), {
            role: newRole
        });
        return true;
    } catch (error) {
        console.error("Error updating user role:", error);
        throw error;
    }
};

export const getAllUsers = async (): Promise<UserData[]> => {
    try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(query(usersCollection));
        
        const users: UserData[] = [];
        usersSnapshot.forEach((doc) => {
            users.push(doc.data() as UserData);
        });
        
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const getUsersByRole = async (role: UserRole): Promise<UserData[]> => {
    try {
        const usersQuery = query(
            collection(db, "users"),
            where("role", "==", role)
        );
        
        const usersSnapshot = await getDocs(usersQuery);
        const users: UserData[] = [];
        usersSnapshot.forEach((doc) => {
            users.push(doc.data() as UserData);
        });
        
        return users;
    } catch (error) {
        console.error("Error fetching users by role:", error);
        throw error;
    }
};

export const getMembersByTrainer = async (trainerId: string): Promise<UserData[]> => {
    try {
        const membersQuery = query(
            collection(db, "users"),
            where("trainerId", "==", trainerId),
            where("role", "==", "member")
        );
        
        const membersSnapshot = await getDocs(membersQuery);
        const members: UserData[] = [];
        membersSnapshot.forEach((doc) => {
            members.push(doc.data() as UserData);
        });
        
        return members;
    } catch (error) {
        console.error("Error fetching members by trainer:", error);
        throw error;
    }
};

export const assignMemberToTrainer = async (memberId: string, trainerId: string): Promise<void> => {
    try {
        const memberRef = doc(db, "users", memberId);
        await updateDoc(memberRef, {
            trainerId: trainerId
        });
    } catch (error) {
        console.error("Error assigning member to trainer:", error);
        throw error;
    }
};

export const removeMemberFromTrainer = async (memberId: string): Promise<void> => {
    try {
        const memberRef = doc(db, "users", memberId);
        await updateDoc(memberRef, {
            trainerId: null
        });
    } catch (error) {
        console.error("Error removing member from trainer:", error);
        throw error;
    }
};

export const uploadProfileImage = async (uri: string, userId: string): Promise<string> => {
    try {
        // Create a blob from the file URI using fetch
        const response = await fetch(uri);
        const blob = await response.blob();
        
        // Add timestamp to make filename unique
        const timestamp = Date.now();
        const fileName = `profile-${timestamp}`;
        const storageRef = ref(storage, `profile-images/${userId}/${fileName}`);
        
        // Upload the blob
        const snapshot = await uploadBytes(storageRef, blob, {
            contentType: blob.type || 'image/jpeg'
        });
        
        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading profile image:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        throw error;
    }
};

export const useGoogleLogin = () => {
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: "385033968866-h7vr2ui9mcpuehlkhndrbrat6ptibvmd.apps.googleusercontent.com",
    });

    React.useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential).then(async (userCredential) => {
                const user = userCredential.user;
                
                // Check if user document exists, if not create one
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (!userDoc.exists()) {
                    const userData: UserData = {
                        uid: user.uid,
                        email: user.email!,
                        displayName: user.displayName || "",
                        role: "member"
                    };
                    await setDoc(doc(db, "users", user.uid), userData);
                }
            });
        }
    }, [response]);

    return { promptAsync, request };
};

export const useFacebookLogin = () => {
    const [request, response, promptAsync] = Facebook.useAuthRequest({
        clientId: "YOUR_FACEBOOK_APP_ID", // Replace with your actual Facebook App ID
        redirectUri: "https://auth.expo.io/@your-expo-username/spartan-fitness" // Replace with your Expo username
    });

    React.useEffect(() => {
        if (response?.type === "success") {
            const { access_token } = response.params;
            const credential = FacebookAuthProvider.credential(access_token);
            signInWithCredential(auth, credential).then(async (userCredential) => {
                const user = userCredential.user;
                
                // Check if user document exists, if not create one
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (!userDoc.exists()) {
                    const userData: UserData = {
                        uid: user.uid,
                        email: user.email!,
                        displayName: user.displayName || "",
                        role: "member"
                    };
                    await setDoc(doc(db, "users", user.uid), userData);
                }
            });
        }
    }, [response]);

    return { promptAsync, request };
};
