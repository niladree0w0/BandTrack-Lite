
"use client";

import type { User, UserRole } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: User | null;
  login: (usernameInput: string, passwordInput: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded credentials
const usersCredentials = {
  admin: { password: "admin123", role: "admin" as UserRole, id: "user_admin" },
  proprietor: { password: "proprietor123", role: "proprietor" as UserRole, id: "user_proprietor" },
  manager: { password: "manager123", role: "manager" as UserRole, id: "user_manager" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for saved user session on initial load (e.g., from localStorage)
    try {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem("currentUser"); // Clear corrupted data
    }
    setIsLoading(false);
  }, []);

  const login = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    setIsLoading(true);
    const usernameKey = usernameInput.toLowerCase() as keyof typeof usersCredentials;
    const userCred = usersCredentials[usernameKey];

    if (userCred && userCred.password === passwordInput) {
      const loggedInUser: User = {
        id: userCred.id,
        username: usernameInput,
        role: userCred.role,
      };
      setUser(loggedInUser);
      try {
        localStorage.setItem("currentUser", JSON.stringify(loggedInUser));
      } catch (error) {
         console.error("Failed to save user to localStorage", error);
      }
      setIsLoading(false);
      router.push("/dashboard");
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("currentUser");
    } catch (error) {
      console.error("Failed to remove user from localStorage", error);
    }
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
