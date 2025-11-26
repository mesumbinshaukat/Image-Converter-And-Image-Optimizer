import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import HomeIcon from '@mui/icons-material/Home';
import CompressIcon from '@mui/icons-material/Compress';
import TransformIcon from '@mui/icons-material/Transform';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';

export default function NavBar() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
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
        { label: 'Home', to: '/', icon: <HomeIcon /> },
        { label: 'Optimize', to: '/optimize', icon: <CompressIcon /> },
        { label: 'Convert', to: '/convert', icon: <TransformIcon /> },
        { label: 'Remove BG', to: '/remove-background', icon: <ContentCutIcon /> },
    ];

    const authItems = isAuthenticated ? [
        { label: 'Logout', action: handleLogout, icon: <LogoutIcon /> }
    ] : [
        { label: 'Login', to: '/login', icon: <LoginIcon /> },
        { label: 'Register', to: '/register', icon: <PersonAddIcon /> }
    ];

    const socialLinks = [
        {
            name: 'Instagram',
            url: 'https://www.instagram.com/world_of_tech_official/',
            icon: <InstagramIcon />,
            color: '#E4405F'
        },
        {
            name: 'LinkedIn',
            url: 'https://pk.linkedin.com/company/world-of-tech-pvt-ltd',
            icon: <LinkedInIcon />,
            color: '#0077B5'
        },
        {
            name: 'Facebook',
            url: 'https://www.facebook.com/worldoftech.softwarehouse.official/',
            icon: <FacebookIcon />,
            color: '#1877F2'
        }
    ];

    const drawer = (
        <Box
            onClick={handleDrawerToggle}
            sx={{
                textAlign: 'center',
                height: '100%',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box sx={{ my: 3, display: 'flex', justifyContent: 'center' }}>
                <img
                    src="/Imgify Logo Transparemt Bg White Text.png"
                    alt="Imgify Logo"
                    style={{ height: '60px', objectFit: 'contain' }}
                />
            </Box>

            {isAuthenticated && user && (
                <Box sx={{ px: 2, py: 1.5, bgcolor: 'rgba(255,255,255,0.1)', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, textAlign: 'center' }}>
                        Hi, {user.username}!
                    </Typography>
                </Box>
            )}

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />

            <List sx={{ flex: 1 }}>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={item.to}
                            sx={{
                                py: 1.5,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    transform: 'translateX(8px)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{ fontWeight: 500 }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}

                <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />

                {authItems.map((item) => {
                    if ('to' in item) {
                        return (
                            <ListItem key={item.label} disablePadding>
                                <ListItemButton
                                    component={RouterLink}
                                    to={item.to}
                                    sx={{
                                        py: 1.5,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.15)',
                                            transform: 'translateX(8px)',
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{ fontWeight: 500 }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    } else {
                        return (
                            <ListItem key={item.label} disablePadding>
                                <ListItemButton
                                    onClick={item.action}
                                    sx={{
                                        py: 1.5,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.15)',
                                            transform: 'translateX(8px)',
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{ fontWeight: 500 }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    }
                })}
            </List>

            {/* Social Media Section */}
            <Box sx={{ pb: 3, px: 2 }}>
                <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, textAlign: 'center' }}>
                    Connect With Us
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    {socialLinks.map((social) => (
                        <IconButton
                            key={social.name}
                            component="a"
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Visit our ${social.name}`}
                            sx={{
                                color: 'white',
                                bgcolor: 'rgba(255,255,255,0.15)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: 'white',
                                    color: social.color,
                                    transform: 'scale(1.1)',
                                },
                            }}
                        >
                            {social.icon}
                        </IconButton>
                    ))}
                </Box>
            </Box>
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
                    <Box
                        component={RouterLink}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                        }}
                    >
                        <img
                            src="/Imgify Logo Transparemt Bg White Text.png"
                            alt="Imgify Logo"
                            style={{
                                height: '80px',
                                objectFit: 'contain',
                            }}
                        />
                    </Box>
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
                        {isAuthenticated && user && (
                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#fff',
                                    display: 'inline-block',
                                    mx: 2,
                                    fontWeight: 500,
                                }}
                            >
                                Hi, {user.username}!
                            </Typography>
                        )}
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
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: 280,
                        },
                        '& .MuiBackdrop-root': {
                            backdropFilter: 'blur(4px)',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                        },
                    }}
                    SlideProps={{
                        timeout: 300,
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
}
