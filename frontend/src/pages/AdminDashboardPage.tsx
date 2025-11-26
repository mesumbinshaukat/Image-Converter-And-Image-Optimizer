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
import ContentCutIcon from '@mui/icons-material/ContentCut';
import api from '../services/api';
import { usePageTracking } from '../hooks/usePageTracking';

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
    usePageTracking();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [pageViews, setPageViews] = useState<any[]>([]);
    const [realtimeActivity, setRealtimeActivity] = useState<any[]>([]);
    const [dateRange, setDateRange] = useState<string>('today');
    const [autoRefresh, setAutoRefresh] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin-access');
        } else if (user?.role !== 'admin') {
            navigate('/');
        } else {
            loadDashboardData();
        }
    }, [isAuthenticated, user, navigate]);

    // Auto-refresh effect for real-time activity
    useEffect(() => {
        if (!autoRefresh || !isAuthenticated || user?.role !== 'admin') return;

        const interval = setInterval(() => {
            loadRealtimeActivity();
        }, 10000); // Refresh every 10 seconds

        return () => clearInterval(interval);
    }, [autoRefresh, isAuthenticated, user]);

    // Reload data when date range changes
    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            loadDashboardData();
        }
    }, [dateRange]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [usersRes, analyticsRes, logsRes, contactsRes, pageViewsRes] = await Promise.allSettled([
                api.get('/admin/users'),
                api.get('/admin/analytics', { params: { period: dateRange } }),
                api.get('/admin/logs'),
                api.get('/admin/contacts'),
                api.get('/admin/analytics/page-views', { params: { period: dateRange } }),
            ]);

            // Handle users response
            if (usersRes.status === 'fulfilled') {
                setUsers(usersRes.value.data.data || []);
            } else {
                console.error('Error loading users:', usersRes.reason);
                setUsers([]);
            }

            // Handle analytics response
            if (analyticsRes.status === 'fulfilled') {
                setAnalytics(analyticsRes.value.data.stats || analyticsRes.value.data || {});
            } else {
                console.error('Error loading analytics:', analyticsRes.reason);
                setAnalytics({
                    total_users: 0,
                    total_images: 0,
                    daily_visitors: 0,
                    active_today: 0,
                });
            }

            // Handle logs response
            if (logsRes.status === 'fulfilled') {
                setLogs(logsRes.value.data.data || []);
            } else {
                console.error('Error loading logs:', logsRes.reason);
                setLogs([]);
            }

            // Handle contacts response
            if (contactsRes.status === 'fulfilled') {
                setContacts(contactsRes.value.data.data || []);
            } else {
                console.error('Error loading contacts:', contactsRes.reason);
                setContacts([]);
            }

            // Handle page views response
            if (pageViewsRes.status === 'fulfilled') {
                setPageViews(pageViewsRes.value.data.data || []);
            } else {
                console.error('Error loading page views:', pageViewsRes.reason);
                setPageViews([]);
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            // Set empty defaults
            setUsers([]);
            setAnalytics({
                total_users: 0,
                total_images: 0,
                daily_visitors: 0,
                active_today: 0,
            });
            setLogs([]);
            setContacts([]);
            setPageViews([]);
        } finally {
            setLoading(false);
        }
    };

    const loadRealtimeActivity = async () => {
        try {
            const response = await api.get('/admin/logs', { params: { limit: 20 } });
            setRealtimeActivity(response.data.data || []);
        } catch (error) {
            console.error('Error loading realtime activity:', error);
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
                                    <PeopleIcon sx={{ fontSize: 48, color: 'primary.main' }} />
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
                                    <ImageIcon sx={{ fontSize: 48, color: 'success.main' }} />
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
                                    <VisibilityIcon sx={{ fontSize: 48, color: 'info.main' }} />
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
                                    <TrendingUpIcon sx={{ fontSize: 48, color: 'warning.main' }} />
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
                                            Background Removals
                                        </Typography>
                                        <Typography variant="h4" fontWeight="bold">
                                            {analytics?.total_background_removals || 0}
                                        </Typography>
                                        <Typography variant="caption" color="success.main">
                                            {analytics?.successful_background_removals || 0} successful
                                        </Typography>
                                    </Box>
                                    <ContentCutIcon sx={{ fontSize: 48, color: 'secondary.main' }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Filters Section */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Date Range
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant={dateRange === 'today' ? 'contained' : 'outlined'}
                                    size="small"
                                    onClick={() => setDateRange('today')}
                                >
                                    Today
                                </Button>
                                <Button
                                    variant={dateRange === 'week' ? 'contained' : 'outlined'}
                                    size="small"
                                    onClick={() => setDateRange('week')}
                                >
                                    Week
                                </Button>
                                <Button
                                    variant={dateRange === 'month' ? 'contained' : 'outlined'}
                                    size="small"
                                    onClick={() => setDateRange('month')}
                                >
                                    Month
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Auto-Refresh
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant={autoRefresh ? 'contained' : 'outlined'}
                                    size="small"
                                    onClick={() => setAutoRefresh(!autoRefresh)}
                                    color={autoRefresh ? 'success' : 'inherit'}
                                >
                                    {autoRefresh ? 'ON' : 'OFF'}
                                </Button>
                                <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                                    {autoRefresh && '(Every 10s)'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Actions
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={loadDashboardData}
                                disabled={loading}
                            >
                                Refresh Now
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Tabs */}
                <Paper sx={{ mb: 3 }}>
                    <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} aria-label="admin tabs">
                        <Tab label="Users" />
                        <Tab label="Activity Logs" />
                        <Tab label="Contact Submissions" />
                        <Tab label="Page Traffic" />
                        <Tab label="Background Removal Stats" />
                        <Tab label="Real-time Activity" />
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

                {/* Page Traffic Tab */}
                <TabPanel value={tabValue} index={3}>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Most Visited Pages
                                    </Typography>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong>Page</strong></TableCell>
                                                    <TableCell align="right"><strong>Views</strong></TableCell>
                                                    <TableCell align="right"><strong>Avg Duration</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {pageViews.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={3} align="center">
                                                            <Typography color="text.secondary">No page view data available</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    pageViews.slice(0, 10).map((page: any, index: number) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{page.page_path}</TableCell>
                                                            <TableCell align="right">{page.views}</TableCell>
                                                            <TableCell align="right">
                                                                {page.avg_duration ? `${Math.floor(page.avg_duration)}s` : 'N/A'}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Traffic Summary
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Total Page Views Today
                                        </Typography>
                                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                                            {analytics?.page_views_today || 0}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Unique Visitors Today
                                        </Typography>
                                        <Typography variant="h4" fontWeight="bold" color="success.main">
                                            {analytics?.unique_visitors_today || 0}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Average Session Duration
                                        </Typography>
                                        <Typography variant="h4" fontWeight="bold" color="info.main">
                                            {analytics?.avg_session_duration ? `${Math.floor(analytics.avg_session_duration)}s` : 'N/A'}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Background Removal Stats Tab */}
                <TabPanel value={tabValue} index={4}>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Total Operations
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold" color="primary.main">
                                        {analytics?.total_background_removals || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Background removals processed
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Success Rate
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold" color="success.main">
                                        {analytics?.total_background_removals > 0
                                            ? Math.round((analytics.successful_background_removals / analytics.total_background_removals) * 100)
                                            : 0}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {analytics?.successful_background_removals || 0} successful / {analytics?.failed_background_removals || 0} failed
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Avg Processing Time
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold" color="info.main">
                                        {analytics?.avg_processing_time ? `${analytics.avg_processing_time}s` : 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Average time per image
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Performance Insights
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                                            <Typography variant="body2" color="success.dark" fontWeight="bold">
                                                ✓ Successful Operations
                                            </Typography>
                                            <Typography variant="h5" color="success.dark" sx={{ mt: 1 }}>
                                                {analytics?.successful_background_removals || 0}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                                            <Typography variant="body2" color="error.dark" fontWeight="bold">
                                                ✗ Failed Operations
                                            </Typography>
                                            <Typography variant="h5" color="error.dark" sx={{ mt: 1 }}>
                                                {analytics?.failed_background_removals || 0}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                </TabPanel>

                {/* Real-time Activity Tab */}
                <TabPanel value={tabValue} index={5}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Live Activity Feed
                        </Typography>
                        <Chip
                            label={autoRefresh ? 'Auto-refreshing' : 'Paused'}
                            color={autoRefresh ? 'success' : 'default'}
                            size="small"
                        />
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Time</strong></TableCell>
                                    <TableCell><strong>User</strong></TableCell>
                                    <TableCell><strong>Action</strong></TableCell>
                                    <TableCell><strong>Description</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {realtimeActivity.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography color="text.secondary">No recent activity</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    realtimeActivity.map((log: any) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                <Typography variant="caption">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {log.user ? (
                                                    <Box>
                                                        <Typography variant="body2">{log.user.username}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {log.user.email}
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary">
                                                        Guest ({log.ip_address})
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={log.action}
                                                    size="small"
                                                    color={
                                                        log.action === 'login' ? 'success' :
                                                            log.action === 'logout' ? 'default' :
                                                                log.action === 'page_view' ? 'info' :
                                                                    'primary'
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{log.description}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={log.status || 'success'}
                                                    size="small"
                                                    color={log.status === 'error' ? 'error' : 'success'}
                                                />
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
