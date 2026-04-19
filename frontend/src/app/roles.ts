export type UserRole = 'customer' | 'organizer' | 'staff';

export const roles: UserRole[] = ['customer', 'organizer', 'staff'];

export const roleLabels: Record<UserRole, string> = {
  customer: 'Customer',
  organizer: 'Organizer',
  staff: 'Staff',
};

export const roleHomePaths: Record<UserRole, string> = {
  customer: '/customer',
  organizer: '/organizer',
  staff: '/staff',
};

export function isUserRole(value: string): value is UserRole {
  return roles.includes(value as UserRole);
}
