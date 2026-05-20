import {AppBar, Box, Button, Container, Stack, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Divider} from '@mui/material';
import { User, LogOut } from 'lucide-react';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { getActiveNavPage, getNavPagesForRole } from './page-registry';
import { roleLabels, type UserRole } from './roles';
import { useAuthSession } from '../features/auth/AuthSessionContext';

function AppShell() {
  const location = useLocation();
  const { user, logout } = useAuthSession();
  const role = (user?.role ?? 'customer') as UserRole;
  const navPages = getNavPagesForRole(role);
  const activeNavPage = getActiveNavPage(role, location.pathname);

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(menuAnchor);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
      setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
      setMenuAnchor(null);
  };

  const handleSignOut = async () => {
      handleMenuClose();
      await logout();
  };

  const username = user?.username ?? 'Guest';
  const roleLabel = roleLabels[role];

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

                <IconButton
                    onClick={handleMenuOpen}
                    size="small"
                    sx={{ p: 0.5 }}
                    aria-controls={menuOpen ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={menuOpen ? 'true' : undefined}
                >
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'primary.main',
                            color: 'secondary.contrastText',
                            fontWeight: 700,
                        }}
                    >
                        <User />
                    </Avatar>
                </IconButton>

                <Menu
                    anchorEl={menuAnchor}
                    id="account-menu"
                    open={menuOpen}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    slotProps={{
                        paper: {
                            sx: {
                                mt: '5px',
                                borderRadius: '10px',
                                width: 200,
                            },
                        },
                    }}
                >
                    <Box sx={{py: 1, px: 2}}>
                        <Typography sx={{ fontWeight: 700, fontSize: 17 }}>
                            {username}
                        </Typography>
                        <Typography sx={{ mb: 1, fontSize: 15 }}>
                            {roleLabel}
                        </Typography>
                    </Box>

                    <Divider sx={{ borderColor: 'primary.main'}} />

                    <MenuItem onClick={handleSignOut}
                      sx={{
                          color: 'error.main',
                          pt: 2,
                          '&:hover': {
                              backgroundColor: 'transparent',
                          },
                      }}
                    >
                        <LogOut/>
                        <Typography sx={{ml: 1, fontWeight: 700}}>
                            Sign Out
                        </Typography>

                    </MenuItem>
                </Menu>
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
