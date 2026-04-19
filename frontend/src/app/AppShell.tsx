import { startTransition } from 'react';
import {
  AppBar,
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppBreadcrumbs } from '../components/AppBreadcrumbs';
import { getActiveNavPage, getNavPagesForRole } from './page-registry';
import { roleHomePaths, roleLabels, roles, type UserRole } from './roles';
import { useRoleSession } from '../features/session/RoleSessionContext';

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, setRole } = useRoleSession();
  const navPages = getNavPagesForRole(role);
  const activeNavPage = getActiveNavPage(role, location.pathname);

  function handleRoleChange(nextRole: UserRole) {
    setRole(nextRole);

    startTransition(() => {
      navigate(roleHomePaths[nextRole]);
    });
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ gap: 2, py: 1.5, flexWrap: 'wrap' }}>
            <Typography variant="h6">TicketPlatform</Typography>

            <Box sx={{ flexGrow: 1 }} />

            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 220 } }}>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                label="Role"
                value={role}
                onChange={(event) => handleRoleChange(event.target.value as UserRole)}
              >
                {roles.map((availableRole) => (
                  <MenuItem key={availableRole} value={availableRole}>
                    {roleLabels[availableRole]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Toolbar>
        </Container>

        <Container maxWidth="xl">
          <Tabs
            value={activeNavPage?.path ?? false}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ minHeight: 56 }}
          >
            {navPages.map((page) => (
              <Tab
                key={page.path}
                value={page.path}
                component={RouterLink}
                to={page.path}
                label={page.navLabel}
              />
            ))}
          </Tabs>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <AppBreadcrumbs />
        <Outlet />
      </Container>
    </Box>
  );
}

export default AppShell;
