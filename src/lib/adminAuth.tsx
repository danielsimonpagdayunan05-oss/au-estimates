import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  getUser,
  handleAuthCallback,
  login as identityLogin,
  logout as identityLogout,
  onAuthChange,
  type User,
} from "@netlify/identity";

interface AdminAuthState {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthState | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await handleAuthCallback();
      } catch {
        // no callback present, or it was invalid/expired — proceed to a normal load
      }
      setUser(await getUser());
      setIsLoading(false);
    })();

    return onAuthChange((_event, currentUser) => {
      setUser(currentUser);
      if (!currentUser) setEditMode(false);
    });
  }, []);

  const isAdmin = !!user?.roles?.includes("admin");

  const value: AdminAuthState = {
    user,
    isAdmin,
    isLoading,
    editMode: editMode && isAdmin,
    setEditMode,
    login: identityLogin,
    logout: identityLogout,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
