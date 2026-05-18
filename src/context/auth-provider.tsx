import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type JSX,
} from "react";
import type { IAuthPayload } from "../types/IAuthPayload.type";
import { AuthService } from "../services/auth.service";
import { LocalStorageKeys } from "../enums/LocalStorageKeys.enum";

export interface IAuthContext {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: IAuthPayload | null;
  isGlobalAdmin: boolean;
}

const AuthContext = createContext<IAuthContext | null>(null);

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<IAuthPayload | null>(getStoredUser());
  const isGlobalAdmin = user?.user?.role === "ADMIN";

  const logout = useCallback(async () => {
    await AuthService.logout();
    setStoredUser(null);
    setUser(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await AuthService.login(email, password);
    setStoredUser(data);
    setUser(data);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getStoredUser());
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isGlobalAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

function getStoredUser() {
  try {
    const value = localStorage.getItem(LocalStorageKeys.user);
    return value ? (JSON.parse(value) as IAuthPayload) : null;
  } catch (e) {
    console.error("Error parsing stored user:", e);
    localStorage.removeItem(LocalStorageKeys.user);
    return null;
  }
}

function setStoredUser(user: IAuthPayload | null) {
  if (user) localStorage.setItem(LocalStorageKeys.user, JSON.stringify(user));
  else localStorage.removeItem(LocalStorageKeys.user);
}
