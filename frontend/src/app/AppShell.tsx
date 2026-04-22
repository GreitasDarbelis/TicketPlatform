import { startTransition } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  FormControl,
  MenuItem,
  Select,
  Stack,
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <AppBar position="sticky" color="primary" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: 88,
              py: 1.5,
              gap: 3,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: 'common.white', fontWeight: 500, letterSpacing: '-0.02em' }}
            >
              TicketPlatform
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                marginLeft: 'auto',
              }}
            >
              {navPages.map((page) => {
                const isActive = page.path === activeNavPage?.path;

                return (
                  <Button
                    key={page.path}
                    component={RouterLink}
                    to={page.path}
                    disableElevation
                    sx={{
                      px: 2.25,
                      py: 1,
                      minWidth: 'auto',
                      borderRadius: '12px',
                      color: 'common.white',
                      backgroundColor: isActive ? 'primary.main' : 'transparent',
                      '&:hover': {
                        backgroundColor: isActive ? 'primary.main' : 'primary.dark',
                      },
                    }}
                  >
                    {page.navLabel}
                  </Button>
                );
              })}

              <FormControl
                size="small"
                sx={{
                  minWidth: 164,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '999px',
                    backgroundColor: 'secondary.main',
                    color: 'common.white',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiSelect-icon': {
                    color: 'common.white',
                  },
                  '& .MuiSelect-select': {
                    py: 1,
                    pr: 4.5,
                    pl: 2,
                    color: 'common.white',
                  },
                }}
              >
              <Select
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
            </Stack>
          </Toolbar>
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
