
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
          // 1. Admin Bootstrap: Check if the email matches the admin email
          if (fbUser.email === ADMIN_EMAIL) {
            resolvedRole = 'admin';
            const adminRoleDocRef = doc(db, "roles", "admin");
            const adminRoleDocSnap = await getDoc(adminRoleDocRef);
            if (adminRoleDocSnap.exists() && adminRoleDocSnap.data().permissions) {
              resolvedPermissions = adminRoleDocSnap.data().permissions as Permission[];
              if (!resolvedPermissions.includes('fullAccess')) { // Ensure admin always has fullAccess
                resolvedPermissions.push('fullAccess');
              }
            } else {
              console.warn("Admin role document ('roles/admin') not found or has no permissions in Firestore. Defaulting to ['fullAccess'].");
              resolvedPermissions = ['fullAccess'];
            }
          } else {
            // 2. For other users, fetch their role from 'users/{uid}' collection
            const userDocRef = doc(db, "users", fbUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists() && userDocSnap.data()?.role) {
              resolvedRole = userDocSnap.data().role as UserRole;
              
              // 3. Fetch permissions for this role from 'roles/{roleName}' collection
              const roleDocRef = doc(db, "roles", resolvedRole);
              const roleDocSnap = await getDoc(roleDocRef);
              if (roleDocSnap.exists() && roleDocSnap.data()?.permissions) {
                resolvedPermissions = roleDocSnap.data().permissions as Permission[];
              } else {
                console.warn(`Permissions for role '${resolvedRole}' not found in 'roles/${resolvedRole}'. User will have no specific permissions.`);
                resolvedPermissions = [];
              }
            } else {
              console.warn(`User document for UID ${fbUser.uid} or role field not found in Firestore. Assigning default role '${resolvedRole}'.`);
              // Attempt to fetch permissions for the default role (e.g., 'manager')
              const defaultRoleDocRef = doc(db, "roles", resolvedRole); // resolvedRole is 'manager' here
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
            // Fallback in case of Firestore error - admin gets full access, others get none
            if (fbUser.email === ADMIN_EMAIL) {
                resolvedRole = 'admin';
                resolvedPermissions = ['fullAccess'];
            } else {
                resolvedPermissions = []; // No permissions if Firestore fetch fails for non-admin
            }
        }

        const appUser: User = {
          id: fbUser.uid,
          username: fbUser.email || "User",
          role: resolvedRole,
          permissions: resolvedPermissions,
        };
        setUser(appUser);

      } else {
        setUser(null);
        setFirebaseUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (emailInput: string, passwordInput: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      // onAuthStateChanged will handle setting the user state.
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
      setUser(null); // Explicitly set user to null
      setFirebaseUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Firebase Logout Error:", error);
    }
    setIsLoading(false); 
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
