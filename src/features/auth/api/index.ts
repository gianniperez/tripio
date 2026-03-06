import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User } from "@/types/tripio";

export const googleProvider = new GoogleAuthProvider();

export const sendPasswordReset = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const syncUserProfile = async (
  firebaseUser: FirebaseUser,
  additionalData: Partial<User> = {},
  autoCreate: boolean = true,
): Promise<User | null> => {
  const userDocRef = doc(db, "users", firebaseUser.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const existingData = userDoc.data() as User;
    // If we have additional data (like name from registration), we update Firestore
    if (Object.keys(additionalData).length > 0) {
      await setDoc(
        userDocRef,
        { ...additionalData, updatedAt: serverTimestamp() },
        { merge: true },
      );
      return { ...existingData, ...additionalData };
    }
    return existingData;
  }

  // Si no existe y no queremos crearlo automáticamente (ej. en Login)
  if (!autoCreate) return null;

  const newUser: User = {
    uid: firebaseUser.uid,
    displayName:
      additionalData.displayName ||
      firebaseUser.displayName ||
      "Viajero Tripio",
    email: firebaseUser.email || "",
    photoURL: firebaseUser.photoURL || null,
    createdAt: Timestamp.now(), // satisfies the User interface for local state
  };

  await setDoc(userDocRef, {
    ...newUser,
    createdAt: serverTimestamp(),
  });

  return newUser;
};

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const loginWithEmail = async (email: string, pass: string) => {
  const res = await signInWithEmailAndPassword(auth, email, pass);
  return res.user;
};

export const registerWithEmail = async (
  email: string,
  pass: string,
  name: string,
) => {
  const res = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(res.user, { displayName: name });
  return res.user;
};

export const logout = async () => {
  await firebaseSignOut(auth);
};

export const subscribeToAuthChanges = (
  callback: (firebaseUser: FirebaseUser | null) => void,
) => {
  return onAuthStateChanged(auth, callback);
};

export const checkUserExists = async (uid: string): Promise<boolean> => {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);
  return userDoc.exists();
};
