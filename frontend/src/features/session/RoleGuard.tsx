import { Navigate, Outlet } from 'react-router-dom';
import { roleHomePaths, type UserRole } from '../../app/roles';
import { useRoleSession } from './RoleSessionContext';

type RoleGuardProps = {
  expectedRole: UserRole;
};

export function RoleGuard({ expectedRole }: RoleGuardProps) {
  const { role } = useRoleSession();

  if (role !== expectedRole) {
    return <Navigate to={roleHomePaths[role]} replace />;
  }

  return <Outlet />;
}
