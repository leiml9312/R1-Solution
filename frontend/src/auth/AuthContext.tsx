import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface AuthUser {
  email: string;
  name: string;
}

interface MockCredential extends AuthUser {
  password: string;
}

// Mock sign-in data — no real identity provider wired up yet. Swap
// MOCK_USERS/signIn for a real call (e.g. Azure AD B2C) once available.
const MOCK_USERS: MockCredential[] = [
  { email: 'demo@r1solution.com', password: 'demo1234', name: 'Demo User' },
];

const STORAGE_KEY = 'r1solution.auth.user';

interface AuthContextValue {
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const signIn = async (email: string, password: string): Promise<AuthUser> => {
    // Simulated latency so the form feels like it's calling a real API.
    await new Promise((resolve) => setTimeout(resolve, 300));
    const match = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
    );
    if (!match) {
      throw new Error('Invalid email or password.');
    }
    const authedUser: AuthUser = { email: match.email, name: match.name };
    setUser(authedUser);
    return authedUser;
  };

  const signOut = () => setUser(null);

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
