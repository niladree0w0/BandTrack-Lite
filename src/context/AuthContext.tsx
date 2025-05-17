
"use client";

import type { User, UserRole } from "@/lib/definitions";
import { auth } from "@/lib/firebase"; // Import Firebase auth instance
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  type User as FirebaseUser
} from "firebase/auth";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null; // Expose Firebase user if needed for more details
  login: (emailInput: string, passwordInput: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Predefined admin email from environment variable
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setIsLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        // Map Firebase user to your app's User type
        // Role assignment: For this example, if the email matches ADMIN_EMAIL, assign 'admin' role.
        // Otherwise, assign 'manager' as a default.
        // In a real app, roles would be fetched from a database (e.g., Firestore) using fbUser.uid.
        let role: UserRole = 'manager'; // Default role
        if (fbUser.email === ADMIN_EMAIL) {
          role = 'admin';
        }
        // You might want to extend this logic for 'proprietor' or other roles
        // based on email or by fetching from a database.

        const appUser: User = {
          id: fbUser.uid, // Use Firebase UID as the user ID
          username: fbUser.email || "User", // Use email as username, or a display name if available
          role: role,
        };
        setUser(appUser);
      } else {
        setUser(null);
        setFirebaseUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (emailInput: string, passwordInput: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      // onAuthStateChanged will handle setting the user state and redirecting
      // No need to manually redirect here if onAuthStateChanged handles it.
      // However, we can ensure redirection upon successful login.
      router.push("/dashboard"); 
      return true;
    } catch (error) {
      console.error("Firebase Login Error:", error);
      setIsLoading(false);
      return false;
    }
    // setIsLoading(false) will be handled by onAuthStateChanged
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged will set user to null.
      router.push("/login");
    } catch (error) {
      console.error("Firebase Logout Error:", error);
    }
    setIsLoading(false); // Ensure loading is set to false even if signOut fails
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
