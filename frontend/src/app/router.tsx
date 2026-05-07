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
import { useAuthSession } from '../features/session/AuthSessionContext';
import { AuthGuard } from '../features/session/AuthGuard';
import AuthPage from '../features/session/AuthPage';
import { Box, CircularProgress } from '@mui/material';

function AuthRedirect() {
  const { status, user } = useAuthSession();

  if (status === 'loading') {
    return (
        <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
          <CircularProgress />
        </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={roleHomePaths[user.role]} replace />;
}

function buildRolePageRoute(page: AppPage, role: UserRole): RouteObject {
  const relativePath = getRoleRelativePath(role, page.path);
  const PageComponent = page.component;
  const element = PageComponent ? <PageComponent /> : <PagePlaceholder page={page} />;

  if (relativePath === '') {
    return { index: true, element };
  }

  return { path: relativePath, element };
}

function buildRoleRoutes(role: UserRole): RouteObject {
  return {
    path: role,
    element: <AuthGuard expectedRole={role} />,
    children: [
      {
        element: <AppShell />,
        children: [
          ...getPagesForRole(role).map((page) => buildRolePageRoute(page, role)),
          { path: '*', element: <AuthRedirect /> },
        ],
      },
    ],
  };
}


export const router = createBrowserRouter([
  { path: '/', element: <AuthRedirect /> },
  { path: '/login', element: <AuthPage /> },
  { path: '/signup', element: <AuthPage /> },
  ...roles.map((r) => buildRoleRoutes(r)),
  { path: '*', element: <AuthRedirect /> },
]);