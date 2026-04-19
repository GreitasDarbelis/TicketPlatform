import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { isUserRole, type UserRole } from '../../app/roles';

type RoleSessionContextValue = {
  role: UserRole;
  setRole: (role: UserRole) => void;
};

const STORAGE_KEY = 'ticket-platform.active-role';

const RoleSessionContext = createContext<RoleSessionContextValue | null>(null);

function getInitialRole(): UserRole {
  const storedRole = window.localStorage.getItem(STORAGE_KEY);

  if (storedRole && isUserRole(storedRole)) {
    return storedRole;
  }

  return 'customer';
}

type RoleSessionProviderProps = {
  children: ReactNode;
};

export function RoleSessionProvider({ children }: RoleSessionProviderProps) {
  const [role, setRole] = useState<UserRole>(getInitialRole);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, role);
  }, [role]);

  return <RoleSessionContext.Provider value={{ role, setRole }}>{children}</RoleSessionContext.Provider>;
}

export function useRoleSession(): RoleSessionContextValue {
  const context = useContext(RoleSessionContext);

  if (!context) {
    throw new Error('useRoleSession must be used within RoleSessionProvider.');
  }

  return context;
}
