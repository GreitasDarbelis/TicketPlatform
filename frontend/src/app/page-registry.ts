import type { ComponentType } from 'react';
import { EventListPage } from '../features/events/EventListPage';
import { EventDetailsPage } from '../features/events/EventDetailsPage';
import CreateEventPage from '../features/events/CreateEventPage';
import EditEventPage from '../features/events/EditEventPage';
import { OrganizerEventsPage } from '../features/events/OrganizerEventsPage';
import { roleHomePaths, type UserRole } from './roles';

export type AppPage = {
  id: string;
  role: UserRole;
  path: string;
  title: string;
  navLabel: string;
  component?: ComponentType;
  showInNav?: boolean;
};

export const appPages: AppPage[] = [
  {
    id: 'customer-overview',
    role: 'customer',
    path: '/customer',
    title: 'Customer',
    navLabel: 'Home',
  },
  {
    id: 'customer-events',
    role: 'customer',
    path: '/customer/events',
    title: 'Events',
    navLabel: 'Events',
    component: EventListPage,
  },
  {
    id: 'customer-event-details',
    role: 'customer',
    path: '/customer/events/:eventId',
    title: 'Event Details',
    navLabel: 'Event Details',
    showInNav: false,
    component: EventDetailsPage,
  },
  {
    id: 'customer-tickets',
    role: 'customer',
    path: '/customer/tickets',
    title: 'My Tickets',
    navLabel: 'My Tickets',
  },
  {
    id: 'organizer-overview',
    role: 'organizer',
    path: '/organizer',
    title: 'Organizer',
    navLabel: 'Home',
  },
  {
    id: 'organizer-events',
    role: 'organizer',
    path: '/organizer/events',
    title: 'Events',
    navLabel: 'Events',
    component: OrganizerEventsPage,
  },
  {
    id: 'organizer-events-new',
    role: 'organizer',
    path: '/organizer/events/new',
    title: 'Create Event',
    navLabel: 'Create Event',
    showInNav: false,
    component: CreateEventPage,
  },
  {
    id: 'organizer-events-edit',
    role: 'organizer',
    path: '/organizer/events/edit/:id',
    title: 'Edit Event',
    navLabel: 'Edit Event',
    showInNav: false,
    component: EditEventPage,
  },
  {
    id: 'staff-overview',
    role: 'staff',
    path: '/staff',
    title: 'Staff',
    navLabel: 'Home',
  },
  {
    id: 'staff-validation',
    role: 'staff',
    path: '/staff/validation',
    title: 'Validation',
    navLabel: 'Validation',
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

export function getBreadcrumbPages(pathname: string): AppPage[] {
  return appPages
    .filter((page) => isPathWithin(page.path, pathname))
    .sort((firstPage, secondPage) => firstPage.path.length - secondPage.path.length);
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
