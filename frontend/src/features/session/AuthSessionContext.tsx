import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { UserRole } from '../../app/roles';
import {
    fetchCurrentUser,
    loginRequest,
    logoutRequest,
    signupRequest,
    type AuthUser,
} from './authApi';

type AuthSessionContextValue = {
    status: 'anonymous' | 'authenticated' | 'loading';
    user: AuthUser | null;
    login: (email: string, password: string) => Promise<AuthUser>;
    signup: (email: string, password: string, role: UserRole) => Promise<AuthUser>;
    logout: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

type AuthSessionProviderProps = {
    children: ReactNode;
};

export function AuthSessionProvider({children}: AuthSessionProviderProps) {
    const [status, setStatus] = useState<AuthSessionContextValue['status']>('loading');
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadSession() {
            try {
                const currentUser = await fetchCurrentUser();

                if (!isMounted) {
                    return;
                }

                if (currentUser) {
                    setUser(currentUser);
                    setStatus('authenticated');
                } else {
                    setUser(null);
                    setStatus('anonymous');
                }
            } catch {
                if (!isMounted) {
                    return;
                }

                setUser(null);
                setStatus('anonymous');
            }
        }

        void loadSession();

        return () => {
            isMounted = false;
        };
    }, []);

    async function login(email: string, password: string): Promise<AuthUser> {
        const loggedInUser = await loginRequest(email, password);
        setUser(loggedInUser);
        setStatus('authenticated');
        return loggedInUser;
    }

    async function signup(email: string, password: string, role: UserRole): Promise<AuthUser> {
        const createdUser = await signupRequest(email, password, role);
        setUser(createdUser);
        setStatus('authenticated');
        return createdUser;
    }

    async function logout(): Promise<void> {
        try {
            await logoutRequest();
        } finally {
            setUser(null);
            setStatus('anonymous');
        }
    }

    const value = useMemo<AuthSessionContextValue>(
        () => ({
            status,
            user,
            login,
            signup,
            logout,
        }),
        [status, user],
    );

    return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}



export function useAuthSession(): AuthSessionContextValue {
    const context = useContext(AuthSessionContext);

    if (!context) {
        throw new Error('useAuthSession must be used within AuthSessionProvider.');
    }

    return context;
}