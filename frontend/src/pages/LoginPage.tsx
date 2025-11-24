import { useState } from 'react'
import { Container, Typography, Box, Button, Paper, TextField, Alert } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/authSlice'
import api from '../services/api'

function LoginPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const isAdminLogin = location.pathname === '/admin-access'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await api.post('/login', { email, password })
            const userData = response.data.user;

            console.log('Login attempt:', { isAdminLogin, role: userData.role });

            if (isAdminLogin && userData.role !== 'admin') {
                setError('Access Denied: Admin rights required');
                setLoading(false);
                return;
            }

            dispatch(setCredentials(response.data))

            if (userData.role === 'admin') {
                navigate('/admin-dashboard')
            } else {
                navigate('/')
            }
        } catch (err: any) {
            console.error('Login error:', err);
            if (err.response?.data?.errors) {
                const errorMessages = Object.values(err.response.data.errors).flat().join(', ');
                setError(errorMessages);
            } else {
                setError(err.response?.data?.message || 'Login failed');
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center' }}>
            <Container maxWidth="sm">
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
                        {isAdminLogin ? 'Admin Login' : 'Login'}
                    </Typography>
                    <Typography color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
                        {isAdminLogin ? 'Sign in to access the admin dashboard' : 'Sign in to your account'}
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 3 }}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Box>
    )
}

export default LoginPage
