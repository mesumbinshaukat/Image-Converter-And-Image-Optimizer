import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';

export default function NavBar() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const navItems = [
        { label: 'Home', to: '/' },
        { label: 'Optimize', to: '/optimize' },
        { label: 'Convert', to: '/convert' },
    ];

    const authItems = isAuthenticated ? [
        { label: 'Logout', action: handleLogout }
    ] : [
        { label: 'Login', to: '/login' },
        { label: 'Register', to: '/register' }
    ];

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Imgify
            </Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton component={RouterLink} to={item.to} sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
                {authItems.map((item) => {
                    if ('to' in item) {
                        return (
                            <ListItem key={item.label} disablePadding>
                                <ListItemButton component={RouterLink} to={item.to} sx={{ textAlign: 'center' }}>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </ListItem>
                        );
                    } else {
                        return (
                            <ListItem key={item.label} disablePadding>
                                <ListItemButton onClick={item.action} sx={{ textAlign: 'center' }}>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </ListItem>
                        );
                    }
                })}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar component="nav" position="static">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
                    >
                        Imgify
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.label}
                                component={RouterLink}
                                to={item.to}
                                sx={{ color: '#fff' }}
                            >
                                {item.label}
                            </Button>
                        ))}
                        {authItems.map((item) => {
                            if ('to' in item) {
                                return (
                                    <Button
                                        key={item.label}
                                        component={RouterLink}
                                        to={item.to}
                                        sx={{ color: '#fff' }}
                                    >
                                        {item.label}
                                    </Button>
                                );
                            } else {
                                return (
                                    <Button
                                        key={item.label}
                                        onClick={item.action}
                                        sx={{ color: '#fff' }}
                                    >
                                        {item.label}
                                    </Button>
                                );
                            }
                        })}
                    </Box>
                </Toolbar>
            </AppBar>
            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
}

