import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Alert,
    Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (form.password !== form.password_confirmation) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await api.post('/register', form);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 1500); // Redirect to login
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', py: 4 }}>
            <Container maxWidth="sm">
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
                        Register
                    </Typography>
                    <Typography color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                        Create a new account
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Registration successful! Redirecting to login...
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            margin="normal"
                            required
                            value={form.name}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            margin="normal"
                            required
                            value={form.email}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            margin="normal"
                            required
                            value={form.password}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="password_confirmation"
                            type="password"
                            margin="normal"
                            required
                            value={form.password_confirmation}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3 }}
                            fullWidth
                            size="large"
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </Button>
                    </Box>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Button onClick={() => navigate('/login')}>
                            Already have an account? Login
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
