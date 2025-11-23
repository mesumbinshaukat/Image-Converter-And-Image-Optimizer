import { Container, Typography, Button, Box, Grid, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ImageIcon from '@mui/icons-material/Image'
import CompressIcon from '@mui/icons-material/Compress'
import TransformIcon from '@mui/icons-material/Transform'

function HomePage() {
    const navigate = useNavigate()

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Header */}


            {/* Hero Section */}
            <Container sx={{ py: 8 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                        <img
                            src="/Imgify Logo Transparent Bg.png"
                            alt="Imgify - Free Online Image Optimizer and Converter"
                            style={{
                                height: '120px',
                                objectFit: 'contain',
                            }}
                        />
                    </Box>
                    <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }} gutterBottom fontWeight="bold">
                        Free Online Image Optimizer & Converter
                    </Typography>
                    <Typography variant="h2" sx={{ fontSize: { xs: '1.25rem', md: '1.75rem' } }} color="text.secondary" sx={{ mb: 2, fontWeight: 400 }}>
                        Compress Images Up to 80% Without Quality Loss
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
                        Professional image optimization and format conversion tool. Reduce file size, convert JPG to PNG, PNG to WebP, and more.
                        Fast, secure, and completely free. No registration required.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/optimize')}
                            startIcon={<CompressIcon />}
                            aria-label="Start optimizing images"
                        >
                            Optimize Images Now
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/convert')}
                            startIcon={<TransformIcon />}
                            aria-label="Convert image format"
                        >
                            Convert Format
                        </Button>
                    </Box>
                </Box>

                {/* Features */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <CompressIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" gutterBottom fontWeight="bold">
                                    Image Optimization
                                </Typography>
                                <Typography color="text.secondary">
                                    Reduce file size by up to 80% without visible quality loss. Automatic metadata removal.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <TransformIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" gutterBottom fontWeight="bold">
                                    Format Conversion
                                </Typography>
                                <Typography color="text.secondary">
                                    Convert between JPG, PNG, WebP, GIF, and more. Maintain quality during conversion.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <ImageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" gutterBottom fontWeight="bold">
                                    Batch Processing
                                </Typography>
                                <Typography color="text.secondary">
                                    Process multiple images at once. Up to 50 images for registered users.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            {/* Footer */}
            <Box sx={{ bgcolor: 'grey.100', py: 4, mt: 8 }}>
                <Container>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>Imgify</Typography>
                            <Typography color="text.secondary">
                                Professional image optimization and conversion tool
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>Links</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Button onClick={() => navigate('/privacy-policy')}>Privacy Policy</Button>
                                <Button onClick={() => navigate('/terms-of-service')}>Terms of Service</Button>
                                <Button onClick={() => navigate('/contact')}>Contact</Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                        © 2024 World Of Tech. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box >
    )
}

export default HomePage
