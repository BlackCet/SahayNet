import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "ADMIN" | "NGO" | "VOLUNTEER" | "GIG_WORKER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  karmaBalance?: number;
  completedTasks?: number;
}

const mockUsers: Record<Role, User> = {
  ADMIN: {
    id: "admin-1",
    name: "Admin User",
    email: "admin@sahaynet.io",
    role: "ADMIN",
    avatar: "A",
  },
  NGO: {
    id: "ngo-1",
    name: "Resilience NGO",
    email: "contact@resilience.org",
    role: "NGO",
    avatar: "R",
  },
  VOLUNTEER: {
    id: "vol-1",
    name: "Kiran Bose",
    email: "kiran@example.com",
    role: "VOLUNTEER",
    avatar: "K",
    karmaBalance: 1250,
    completedTasks: 14,
  },
  GIG_WORKER: {
    id: "gig-1",
    name: "Rahul S.",
    email: "rahul.s@example.com",
    role: "GIG_WORKER",
    avatar: "RS",
    karmaBalance: 400,
    completedTasks: 21,
  },
};

interface AuthContextType {
  user: User;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(mockUsers.ADMIN);

  const switchRole = (role: Role) => {
    setUser(mockUsers[role]);
  };

  return (
    <AuthContext.Provider value={{ user, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
