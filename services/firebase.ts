// Firebase Configuration for Rosita Pastelaria
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, onSnapshot, writeBatch } from "firebase/firestore";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWd9If7LObfjjoxfY3qXx4eEBguXeIXVU",
  authDomain: "rosita-pastelaria.firebaseapp.com",
  projectId: "rosita-pastelaria",
  storageBucket: "rosita-pastelaria.firebasestorage.app",
  messagingSenderId: "913254703846",
  appId: "1:913254703846:web:583ba6297bdc19bc4f5127"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Admin email (the only user allowed to edit)
export const ADMIN_EMAIL = "rositapastelariaofc@gmail.com";

// Collection references
export const COLLECTIONS = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CATEGORIES: 'categories',
  TESTIMONIALS: 'testimonials',
  BLOG_POSTS: 'blogPosts',
  SITE_CONFIG: 'siteConfig',
  USERS: 'users'
};

// Helper functions for Firestore operations
export const firestoreHelpers = {
  // Get all documents from a collection
  async getAll<T>(collectionName: string): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as T));
    } catch (error) {
      console.error(`Error getting ${collectionName}:`, error);
      return [];
    }
  },

  // Set a document (create or update)
  async set<T extends { id: string }>(collectionName: string, data: T): Promise<void> {
    try {
      const docRef = doc(db, collectionName, data.id);
      await setDoc(docRef, data);
    } catch (error) {
      console.error(`Error setting document in ${collectionName}:`, error);
      throw error;
    }
  },

  // Delete a document
  async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  },

  // Set multiple documents at once (batch)
  async setMultiple<T extends { id: string }>(collectionName: string, items: T[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      items.forEach(item => {
        const docRef = doc(db, collectionName, item.id);
        batch.set(docRef, item);
      });
      await batch.commit();
    } catch (error) {
      console.error(`Error batch setting documents in ${collectionName}:`, error);
      throw error;
    }
  },

  // Subscribe to real-time updates
  subscribe<T>(collectionName: string, callback: (data: T[]) => void): () => void {
    const unsubscribe = onSnapshot(collection(db, collectionName), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as T));
      callback(data);
    }, (error) => {
      console.error(`Error subscribing to ${collectionName}:`, error);
    });
    return unsubscribe;
  },

  // Get single document
  async getSingle<T>(collectionName: string, docId: string): Promise<T | null> {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const doc = querySnapshot.docs.find(d => d.id === docId);
      return doc ? ({ ...doc.data(), id: doc.id } as T) : null;
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      return null;
    }
  },

  // Set single config document (for siteConfig which is a single document)
  async setConfig<T>(collectionName: string, docId: string, data: T): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, data);
    } catch (error) {
      console.error(`Error setting config in ${collectionName}:`, error);
      throw error;
    }
  }
};

// Firebase Auth helpers
export const authHelpers = {
  // Login with email and password
  async login(email: string, password: string): Promise<FirebaseUser> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  // Login with Google
  async loginWithGoogle(): Promise<FirebaseUser> {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  },

  // Logout
  async logout(): Promise<void> {
    await signOut(auth);
  },

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  },

  // Check if current user is admin
  isAdmin(): boolean {
    const user = auth.currentUser;
    return user?.email === ADMIN_EMAIL;
  },

  // Subscribe to auth state changes
  onAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }
};

export { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot };
export type { FirebaseUser };
