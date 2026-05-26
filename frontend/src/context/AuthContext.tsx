import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import api from '../api';

interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

export interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    updateUser: (updatedUser: User) => void;
    isAuthenticated: boolean;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Cek status login saat aplikasi dimuat
        const checkAuth = async () => {
            try {
                const response = await api.get('/api/user');
                setUser(response.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = (newUser: User) => {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));

        // Sync with the saved accounts list
        const saved = localStorage.getItem('saved_accounts');
        const accounts: User[] = saved ? JSON.parse(saved) : [];
        const filtered = accounts.filter(acc => acc.email !== newUser.email);
        filtered.unshift(newUser);
        localStorage.setItem('saved_accounts', JSON.stringify(filtered));

        navigate('/');
    };

    const logout = async () => {
        try {
            await api.post('/api/logout');
        } catch (err) {
            console.error('Logout failed', err);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Sync updated info with saved accounts
        const saved = localStorage.getItem('saved_accounts');
        if (saved) {
            const accounts: User[] = JSON.parse(saved);
            const index = accounts.findIndex(acc => acc.email === updatedUser.email);
            if (index !== -1) {
                accounts[index] = updatedUser;
                localStorage.setItem('saved_accounts', JSON.stringify(accounts));
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};


