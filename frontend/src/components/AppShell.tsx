import { ReactNode } from 'react';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const NAV_LINKS = [
  { to: '/portal', label: 'Records' },
  { to: '/documents', label: 'Documents' },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    signOut();
    navigate('/', { replace: true });
  };

  return (
    <Box>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar sx={{ gap: 1 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            R1 Solution
          </Typography>
          {NAV_LINKS.map((link) => (
            <Button
              key={link.to}
              component={RouterLink}
              to={link.to}
              color="inherit"
              sx={{ opacity: location.pathname === link.to ? 1 : 0.75 }}
            >
              {link.label}
            </Button>
          ))}
          {user && (
            <Typography variant="body2" sx={{ mx: 2, opacity: 0.85 }}>
              {user.name}
            </Typography>
          )}
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleSignOut}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  );
}
