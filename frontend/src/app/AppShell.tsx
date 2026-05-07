import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { getActiveNavPage, getNavPagesForRole } from './page-registry';
import { roleLabels, type UserRole } from './roles';
import { useAuthSession } from '../features/session/AuthSessionContext';

function AppShell() {
  const location = useLocation();
  const { user } = useAuthSession();
  const role = (user?.role ?? 'customer') as UserRole;
  const navPages = getNavPagesForRole(role);
  const activeNavPage = getActiveNavPage(role, location.pathname);

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

              <Typography sx={{ color: 'common.white', fontWeight: 500, textTransform: 'capitalize' }}>
                {roleLabels[role]}
              </Typography>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default AppShell;
