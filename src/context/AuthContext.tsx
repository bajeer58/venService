import React, { useState } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { AuthContext } from './AuthContextInstance';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('venservice_user');
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string, role: UserRole) => {
        setIsLoading(true);
        // Simulate API call and JWT generation
        const mockUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0],
            email,
            role,
            accessToken: 'mock-jwt-token-' + Date.now(),
        };

        setUser(mockUser);
        localStorage.setItem('venservice_user', JSON.stringify(mockUser));
        setIsLoading(false);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('venservice_user');
    };

    const hasRole = (roles: UserRole[]) => {
        if (!user) return false;
        return roles.includes(user.role);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};
