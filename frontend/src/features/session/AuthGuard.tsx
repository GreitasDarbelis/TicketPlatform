import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuthSession } from './AuthSessionContext';
import {roleHomePaths, type UserRole} from "../../app/roles";

type AuthGuardProps = {
    expectedRole: UserRole;
};

export function AuthGuard({ expectedRole }: AuthGuardProps) {
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

    if (expectedRole && user.role !== expectedRole) {
        return <Navigate to={roleHomePaths[user.role]} replace />;
    }

    return <Outlet />;
}
