import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Button,
    Tab,
    Tabs,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import ImageIcon from '@mui/icons-material/Image';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import api from '../services/api';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`admin-tabpanel-${index}`}
            aria-labelledby={`admin-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

export default function AdminDashboardPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin-access');
        } else if (user?.role !== 'admin') {
            navigate('/');
        } else {
            loadDashboardData();
        }
    }, [isAuthenticated, user, navigate]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [usersRes, analyticsRes, logsRes, contactsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/analytics'),
                api.get('/admin/logs'),
                api.get('/admin/contacts'),
            ]);

            setUsers(usersRes.data.users || []);
            setAnalytics(analyticsRes.data || {});
            setLogs(logsRes.data.logs || []);
            setContacts(contactsRes.data.contacts || []);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleDeleteUser = async (userId: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/admin/users/${userId}`);
                setUsers(users.filter(u => u.id !== userId));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleMarkContactReviewed = async (contactId: number) => {
        try {
            await api.patch(`/admin/contacts/${contactId}/review`);
            setContacts(contacts.map(c => c.id === contactId ? { ...c, reviewed: true } : c));
        } catch (error) {
            console.error('Error marking contact as reviewed:', error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Admin Dashboard
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Welcome back, {user?.username}! Manage your platform from here.
                        </Typography>
                    </Box>
                    <Button variant="outlined" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography color="text.secondary" variant="body2" gutterBottom>
                                            Total Users
                                        </Typography>
                                        <Typography variant="h4" fontWeight="bold">
                                            {analytics?.total_users || users.length}
                                        </Typography>
                                    </Box>
                                    <PeopleIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography color="text.secondary" variant="body2" gutterBottom>
                                            Images Processed
                                        </Typography>
                                        <Typography variant="h4" fontWeight="bold">
                                            {analytics?.total_images || 0}
                                        </Typography>
                                    </Box>
                                    <ImageIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.3 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography color="text.secondary" variant="body2" gutterBottom>
                                            Daily Visitors
                                        </Typography>
                                        <Typography variant="h4" fontWeight="bold">
                                            {analytics?.daily_visitors || 0}
                                        </Typography>
                                    </Box>
                                    <VisibilityIcon sx={{ fontSize: 48, color: 'info.main', opacity: 0.3 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography color="text.secondary" variant="body2" gutterBottom>
                                            Active Today
                                        </Typography>
                                        <Typography variant="h4" fontWeight="bold">
                                            {analytics?.active_today || 0}
                                        </Typography>
                                    </Box>
                                    <TrendingUpIcon sx={{ fontSize: 48, color: 'warning.main', opacity: 0.3 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Tabs */}
                <Paper sx={{ mb: 3 }}>
                    <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} aria-label="admin tabs">
                        <Tab label="Users" />
                        <Tab label="Activity Logs" />
                        <Tab label="Contact Submissions" />
                    </Tabs>
                </Paper>

                {/* Users Tab */}
                <TabPanel value={tabValue} index={0}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>ID</strong></TableCell>
                                    <TableCell><strong>Username</strong></TableCell>
                                    <TableCell><strong>Email</strong></TableCell>
                                    <TableCell><strong>Role</strong></TableCell>
                                    <TableCell><strong>Joined</strong></TableCell>
                                    <TableCell align="right"><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <Typography color="text.secondary">No users found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={user.role}
                                                    color={user.role === 'admin' ? 'error' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell align="right">
                                                {user.role !== 'admin' && (
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

                {/* Activity Logs Tab */}
                <TabPanel value={tabValue} index={1}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Time</strong></TableCell>
                                    <TableCell><strong>User</strong></TableCell>
                                    <TableCell><strong>Action</strong></TableCell>
                                    <TableCell><strong>IP Address</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography color="text.secondary">No activity logs found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.slice(0, 50).map((log, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                                            <TableCell>{log.user_id || 'Guest'}</TableCell>
                                            <TableCell>{log.action}</TableCell>
                                            <TableCell>{log.ip_address}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={log.status || 'success'}
                                                    color={log.status === 'error' ? 'error' : 'success'}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>

                {/* Contact Submissions Tab */}
                <TabPanel value={tabValue} index={2}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Date</strong></TableCell>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell><strong>Email</strong></TableCell>
                                    <TableCell><strong>Subject</strong></TableCell>
                                    <TableCell><strong>Message</strong></TableCell>
                                    <TableCell align="right"><strong>Status</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {contacts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <Typography color="text.secondary">No contact submissions found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    contacts.map((contact) => (
                                        <TableRow key={contact.id}>
                                            <TableCell>{new Date(contact.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>{contact.name}</TableCell>
                                            <TableCell>{contact.email}</TableCell>
                                            <TableCell>{contact.subject || 'N/A'}</TableCell>
                                            <TableCell sx={{ maxWidth: 300 }}>
                                                {contact.message.substring(0, 100)}...
                                            </TableCell>
                                            <TableCell align="right">
                                                {contact.reviewed ? (
                                                    <Chip label="Reviewed" color="success" size="small" />
                                                ) : (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => handleMarkContactReviewed(contact.id)}
                                                    >
                                                        Mark Reviewed
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
            </Container>
        </Box>
    );
}
