import type { ComponentType } from 'react';
import { EventListPage } from '../features/events/EventListPage';
import { roleHomePaths, type UserRole } from './roles';

export type AppPage = {
  id: string;
  role: UserRole;
  path: string;
  title: string;
  navLabel: string;
  component?: ComponentType<{page: AppPage}>;
  showInNav?: boolean;
};

export const appPages: AppPage[] = [
  {
    id: 'customer-events',
    role: 'customer',
    path: '/customer',
    title: 'Browse Events',
    navLabel: 'Browse Events',
    component: EventListPage,
  },
  {
    id: 'customer-tickets',
    role: 'customer',
    path: '/customer/tickets',
    title: 'My Tickets',
    navLabel: 'My Tickets',
  },
  {
    id: 'organizer-events',
    role: 'organizer',
    path: '/organizer',
    title: 'My Events',
    navLabel: 'Events',
    showInNav: false,
  },
  {
    id: 'staff-events',
    role: 'staff',
    path: '/staff',
    title: 'Select Event for Validation',
    navLabel: 'Home',
    showInNav: false,
  },
];

function normalizePath(path: string): string {
  const normalized = path.replace(/\/+$/, '');

  return normalized === '' ? '/' : normalized;
}

function countSegments(path: string): number {
  return normalizePath(path).split('/').filter(Boolean).length;
}

function isPathWithin(basePath: string, currentPath: string): boolean {
  const normalizedBase = normalizePath(basePath);
  const normalizedCurrent = normalizePath(currentPath);

  return (
    normalizedCurrent === normalizedBase || normalizedCurrent.startsWith(`${normalizedBase}/`)
  );
}

export function getPagesForRole(role: UserRole): AppPage[] {
  return appPages.filter((page) => page.role === role);
}

export function getNavPagesForRole(role: UserRole): AppPage[] {
  return getPagesForRole(role).filter((page) => page.showInNav !== false);
}

export function getActiveNavPage(role: UserRole, pathname: string): AppPage | null {
  const matchingNavPages = getNavPagesForRole(role)
    .filter((page) => isPathWithin(page.path, pathname))
    .sort((firstPage, secondPage) => secondPage.path.length - firstPage.path.length);

  return matchingNavPages[0] ?? null;
}

export function getImmediateChildPages(parentPath: string): AppPage[] {
  const parentSegments = countSegments(parentPath);

  return appPages.filter((page) => {
    if (page.path === parentPath) {
      return false;
    }

    return isPathWithin(parentPath, page.path) && countSegments(page.path) === parentSegments + 1;
  });
}

export function getRoleRelativePath(role: UserRole, pagePath: string): string {
  const roleBasePath = roleHomePaths[role];

  if (pagePath === roleBasePath) {
    return '';
  }

  return pagePath.slice(roleBasePath.length + 1);
}
