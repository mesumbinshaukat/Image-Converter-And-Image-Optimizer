import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';

export default function AdminDashboardPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin-access');
        } else if (user?.role !== 'admin') {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <Box sx={{ p: 4, minHeight: '100vh', bgcolor: 'background.default' }}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Welcome, you are logged in as an admin. Here you can manage users, view analytics, and monitor activity logs.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleLogout}>
                Logout
            </Button>
        </Box>
    );
}
