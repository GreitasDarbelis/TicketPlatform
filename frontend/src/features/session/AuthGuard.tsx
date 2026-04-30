import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuthSession } from './AuthSessionContext';

export function AuthGuard() {
    const { status, user } = useAuthSession();
    const location = useLocation();

    if (status === 'loading') {
        return (
            <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}
