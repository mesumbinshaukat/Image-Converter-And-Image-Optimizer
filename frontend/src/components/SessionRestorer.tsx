import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setCredentials, logout } from '../store/authSlice';
import api from '../services/api';
import { CircularProgress, Box } from '@mui/material';

export default function SessionRestorer({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const { token, user } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(!!token && !user);

    useEffect(() => {
        const restoreSession = async () => {
            if (token && !user) {
                try {
                    const response = await api.get('/me');
                    dispatch(setCredentials({ user: response.data.user, token }));
                } catch (error) {
                    console.error('Failed to restore session:', error);
                    dispatch(logout());
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        restoreSession();
    }, [token, user, dispatch]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return <>{children}</>;
}
