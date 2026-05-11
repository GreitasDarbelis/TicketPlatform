import { startTransition, useEffect, useState, type MouseEvent } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import PersonOutlineOutlined from '@mui/icons-material/PersonOutlineOutlined';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getNavPagesForRole } from './page-registry';
import { roleHomePaths, roleLabels, roles, type UserRole } from './roles';
import { useRoleSession } from '../features/session/RoleSessionContext';

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, setRole } = useRoleSession();
  const [roleMenuAnchor, setRoleMenuAnchor] = useState<HTMLElement | null>(null);
  const navPages = getNavPagesForRole(role);
  const isRoleMenuOpen = Boolean(roleMenuAnchor);

  useEffect(() => {
    window.scrollTo({ left: 0, top: 0 });
  }, [location.pathname]);

  function handleRoleMenuOpen(event: MouseEvent<HTMLElement>) {
    setRoleMenuAnchor(event.currentTarget);
  }

  function handleRoleMenuClose() {
    setRoleMenuAnchor(null);
  }

  function handleRoleChange(nextRole: UserRole) {
    setRoleMenuAnchor(null);
    setRole(nextRole);

    startTransition(() => {
      navigate(roleHomePaths[nextRole]);
    });
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <AppBar position="sticky" color="primary" elevation={0}>
        <Container maxWidth={false} sx={{ px: { xs: 3, md: 8, lg: 12.5 } }}>
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 96, md: 140 },
              gap: 3,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Typography
              component={RouterLink}
              to={roleHomePaths[role]}
              variant="h3"
              sx={{
                color: 'common.white',
                fontSize: { xs: '2rem', md: '2.7rem' },
                fontWeight: 500,
                letterSpacing: 0,
                lineHeight: 1,
              }}
            >
              Greitas Darbelis
            </Typography>

            <Stack
              direction="row"
              spacing={{ xs: 1.5, md: 4 }}
              sx={{
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                marginLeft: 'auto',
              }}
            >
              {navPages.map((page) => {
                return (
                  <Button
                    key={page.path}
                    component={RouterLink}
                    to={page.path}
                    disableElevation
                    sx={{
                      px: { xs: 1.5, md: 2 },
                      py: 1,
                      minWidth: 'auto',
                      borderRadius: '8px',
                      color: 'common.white',
                      fontSize: { xs: '1rem', md: '1.35rem' },
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    {page.navLabel}
                  </Button>
                );
              })}

              <IconButton
                aria-label="Open role menu"
                aria-controls={isRoleMenuOpen ? 'role-menu' : undefined}
                aria-haspopup="menu"
                aria-expanded={isRoleMenuOpen ? 'true' : undefined}
                onClick={handleRoleMenuOpen}
                sx={{
                  width: { xs: 56, md: 78 },
                  height: { xs: 56, md: 78 },
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'common.white',
                  flex: '0 0 auto',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                <PersonOutlineOutlined sx={{ fontSize: { xs: 30, md: 40 } }} />
              </IconButton>
              <Menu
                id="role-menu"
                anchorEl={roleMenuAnchor}
                open={isRoleMenuOpen}
                onClose={handleRoleMenuClose}
              >
                {roles.map((availableRole) => (
                  <MenuItem
                    key={availableRole}
                    selected={availableRole === role}
                    onClick={() => handleRoleChange(availableRole)}
                  >
                    {roleLabels[availableRole]}
                  </MenuItem>
                ))}
              </Menu>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth={false} sx={{ px: { xs: 3, md: 8, lg: 12.5 }, py: { xs: 4, md: 7.5 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default AppShell;
