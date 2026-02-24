import { createContext } from 'react';
import type { User, UserRole } from '../types';

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, role: UserRole) => Promise<void>;
    logout: () => void;
    hasRole: (roles: UserRole[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
