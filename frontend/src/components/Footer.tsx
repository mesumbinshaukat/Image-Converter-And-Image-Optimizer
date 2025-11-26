import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';

export default function Footer() {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

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

    const quickLinks = [
        { label: 'Home', path: '/' },
        { label: 'Optimize Images', path: '/optimize' },
        { label: 'Convert Images', path: '/convert' },
        { label: 'Remove Background', path: '/remove-background' },
        { label: 'About Us', path: '/about' },
        { label: 'Contact Us', path: '/contact' },
    ];

    const legalLinks = [
        { label: 'Privacy Policy', path: '/privacy-policy' },
        { label: 'Terms of Service', path: '/terms-of-service' },
    ];

    return (
        <Box
            component="footer"
            sx={{
                background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
                color: 'white',
                pt: 6,
                pb: 3,
                mt: 8,
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Company Info */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ mb: 2 }}>
                            <img
                                src="/Imgify Logo Transparemt Bg White Text.png"
                                alt="Imgify Logo"
                                style={{ height: '60px', objectFit: 'contain', marginBottom: '16px' }}
                            />
                        </Box>
                        <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}>
                            Professional image optimization and conversion tool. Fast, secure, and completely free.
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <EmailIcon sx={{ fontSize: 18 }} />
                            info@worldoftech.company
                        </Typography>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                            Quick Links
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    onClick={() => navigate(link.path)}
                                    sx={{
                                        color: 'rgba(255,255,255,0.7)',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            color: '#8B5CF6',
                                            transform: 'translateX(5px)',
                                        },
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    {/* Resources & Legal */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                            Resources
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {legalLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    onClick={() => navigate(link.path)}
                                    sx={{
                                        color: 'rgba(255,255,255,0.7)',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            color: '#8B5CF6',
                                            transform: 'translateX(5px)',
                                        },
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </Box>
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                                Features
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                ✓ AI background removal
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                ✓ Up to 80% compression
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                ✓ Multiple format support
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                                ✓ Batch processing
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                ✓ No watermarks
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Social Media & Connect */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                            Connect With Us
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}>
                            Follow us on social media for updates and tips
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                            {socialLinks.map((social) => (
                                <IconButton
                                    key={social.name}
                                    component="a"
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Visit our ${social.name}`}
                                    sx={{
                                        color: 'white',
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: social.color,
                                            transform: 'translateY(-5px)',
                                            boxShadow: `0 5px 15px ${social.color}40`,
                                        },
                                    }}
                                >
                                    {social.icon}
                                </IconButton>
                            ))}
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                            <strong>World Of Tech Pvt Ltd</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            Empowering digital transformation through innovative solutions
                        </Typography>
                    </Grid>
                </Grid>

                {/* Divider */}
                <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.1)' }} />

                {/* Bottom Section */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', textAlign: { xs: 'center', sm: 'left' } }}>
                        © {currentYear} World Of Tech Pvt Ltd. All rights reserved.
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', textAlign: { xs: 'center', sm: 'right' } }}>
                        Made with ❤️ for better web performance
                    </Typography>
                </Box>

                {/* SEO Content */}
                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: '0.75rem' }}>
                        <strong>Imgify</strong> - Free online image optimizer, converter, and AI background remover. Compress JPG, PNG, WebP, GIF images without quality loss.
                        Convert between image formats instantly. Remove backgrounds with AI technology. Professional image optimization tool for web developers, designers, and content creators.
                        Reduce image file size, improve website speed, and enhance SEO with our powerful image compression technology.
                        Supports batch processing, maintains image quality, and provides instant downloads. No registration required for basic features.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
