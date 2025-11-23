import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
            }}
        >
            <Container maxWidth="md">
                <Box sx={{ textAlign: 'center' }}>
                    <SentimentVeryDissatisfiedIcon
                        sx={{
                            fontSize: 120,
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 3,
                        }}
                    />

                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '4rem', md: '6rem' },
                            fontWeight: 700,
                            mb: 2,
                        }}
                    >
                        404
                    </Typography>

                    <Typography variant="h4" gutterBottom fontWeight="600" color="text.primary">
                        Page Not Found
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<HomeIcon />}
                            onClick={() => navigate('/')}
                        >
                            Go to Homepage
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate(-1)}
                        >
                            Go Back
                        </Button>
                    </Box>

                    <Box sx={{ mt: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                            Need help? Visit our{' '}
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => navigate('/contact')}
                                sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                            >
                                Contact Page
                            </Button>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
