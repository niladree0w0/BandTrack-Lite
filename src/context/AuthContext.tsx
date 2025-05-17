
"use client";

import type { User, UserRole, Permission } from "@/lib/definitions";
import { auth, db } from "@/lib/firebase"; // Import Firebase auth and db instance
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  type User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Firestore imports
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null; 
  login: (emailInput: string, passwordInput: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setIsLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        
        let resolvedRole: UserRole = 'manager'; // Default role
        let resolvedPermissions: Permission[] = [];

        try {
          if (fbUser.email === ADMIN_EMAIL) {
            resolvedRole = 'admin';
            const adminRoleDocRef = doc(db, "roles", "admin");
            const adminRoleDocSnap = await getDoc(adminRoleDocRef);
            if (adminRoleDocSnap.exists() && adminRoleDocSnap.data()?.permissions) {
              resolvedPermissions = adminRoleDocSnap.data().permissions as Permission[];
              if (!resolvedPermissions.includes('fullAccess')) {
                // Ensure admin always has fullAccess if their Firestore doc is incomplete
                resolvedPermissions.push('fullAccess'); 
              }
            } else {
              console.warn("Admin role document ('roles/admin') not found or has no permissions in Firestore. Defaulting to ['fullAccess'].");
              resolvedPermissions = ['fullAccess'];
            }
          } else {
            const userDocRef = doc(db, "users", fbUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists() && userDocSnap.data()?.role) {
              resolvedRole = userDocSnap.data().role as UserRole;
              
              const roleDocRef = doc(db, "roles", resolvedRole);
              const roleDocSnap = await getDoc(roleDocRef);
              if (roleDocSnap.exists() && roleDocSnap.data()?.permissions) {
                resolvedPermissions = roleDocSnap.data().permissions as Permission[];
              } else {
                console.warn(`Permissions for role '${resolvedRole}' not found in 'roles/${resolvedRole}' Firestore document. User will have no specific permissions.`);
                resolvedPermissions = []; 
              }
            } else {
              console.warn(`User document for UID ${fbUser.uid} or its 'role' field not found in Firestore. Assigning default role '${resolvedRole}'. Attempting to load default role permissions.`);
              const defaultRoleDocRef = doc(db, "roles", resolvedRole); 
              const defaultRoleDocSnap = await getDoc(defaultRoleDocRef);
              if (defaultRoleDocSnap.exists() && defaultRoleDocSnap.data()?.permissions) {
                resolvedPermissions = defaultRoleDocSnap.data().permissions as Permission[];
              } else {
                console.warn(`Default role document for '${resolvedRole}' also not found or has no permissions. User will have no specific permissions.`);
                resolvedPermissions = [];
              }
            }
          }
        } catch (error) {
            console.error("Error fetching user role/permissions from Firestore:", error);
            // Fallback in case of Firestore error during permission fetching
            if (fbUser.email === ADMIN_EMAIL) {
                resolvedRole = 'admin';
                resolvedPermissions = ['fullAccess'];
            } else {
                // For other users, if Firestore fails, they get no permissions.
                // Consider if a different fallback is more appropriate for your app.
                resolvedPermissions = []; 
            }
        }

        const appUser: User = {
          id: fbUser.uid,
          username: fbUser.email || "User", // Use email as username
          role: resolvedRole,
          permissions: resolvedPermissions,
        };
        // --- IMPORTANT FOR DEBUGGING PERMISSIONS ---
        // Check your browser's developer console for this log message.
        // It shows the role and permissions the app has determined for the logged-in user.
        console.log(`[AuthContext] User Authenticated: ${appUser.username}, Role: ${appUser.role}, Permissions: ${JSON.stringify(appUser.permissions)}`);
        setUser(appUser);

      } else {
        setUser(null);
        setFirebaseUser(null);
        console.log("[AuthContext] User signed out or not authenticated.");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (emailInput: string, passwordInput: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      // onAuthStateChanged will handle setting user state and initial redirect
      router.push("/dashboard"); 
      return true;
    } catch (error) {
      console.error("Firebase Login Error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null); 
      setFirebaseUser(null);
      router.push("/login"); // Explicitly redirect to login on logout
    } catch (error) {
      console.error("Firebase Logout Error:", error);
    }
    // Setting loading to false moved to onAuthStateChanged to ensure user state is cleared first
    // setIsLoading(false); 
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
