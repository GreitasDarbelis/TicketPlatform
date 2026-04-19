import type { RouteObject } from 'react-router-dom';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import AppShell from './AppShell';
import {
  getPagesForRole,
  getRoleRelativePath,
  type AppPage,
} from './page-registry';
import { roleHomePaths, roles, type UserRole } from './roles';
import { PagePlaceholder } from '../components/PagePlaceholder';
import { RoleGuard } from '../features/session/RoleGuard';
import { useRoleSession } from '../features/session/RoleSessionContext';

function RootRedirect() {
  const { role } = useRoleSession();

  return <Navigate to={roleHomePaths[role]} replace />;
}

function CatchAllRedirect() {
  const { role } = useRoleSession();

  return <Navigate to={roleHomePaths[role]} replace />;
}

function buildRolePageRoute(page: AppPage, role: UserRole): RouteObject {
  const relativePath = getRoleRelativePath(role, page.path);
  const PageComponent = page.component;
  const element = PageComponent ? <PageComponent /> : <PagePlaceholder page={page} />;

  if (relativePath === '') {
    return {
      index: true,
      element,
    };
  }

  return {
    path: relativePath,
    element,
  };
}

function buildRoleRoutes(role: UserRole): RouteObject {
  return {
    path: role,
    element: <RoleGuard expectedRole={role} />,
    children: [
      {
        element: <AppShell />,
        children: [
          ...getPagesForRole(role).map((page) => buildRolePageRoute(page, role)),
          {
            path: '*',
            element: <CatchAllRedirect />,
          },
        ],
      },
    ],
  };
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  ...roles.map((role) => buildRoleRoutes(role)),
  {
    path: '*',
    element: <CatchAllRedirect />,
  },
]);
