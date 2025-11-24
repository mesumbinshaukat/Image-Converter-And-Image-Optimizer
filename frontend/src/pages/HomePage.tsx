import { Container, Typography, Button, Box, Grid, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ImageIcon from '@mui/icons-material/Image'
import CompressIcon from '@mui/icons-material/Compress'
import TransformIcon from '@mui/icons-material/Transform'
import Footer from '../components/Footer'
import FAQSection from '../components/FAQSection'
import HowItWorks from '../components/HowItWorks'
import { usePageTracking } from '../hooks/usePageTracking'

function HomePage() {
    const navigate = useNavigate()
    usePageTracking()

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Hero Section */}
            <Container sx={{ py: 8 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                        <img
                            src="/Imgify Logo Transparent Bg.png"
                            alt="Imgify - Free Online Image Optimizer and Converter Tool"
                            style={{
                                height: '120px',
                                objectFit: 'contain',
                            }}
                        />
                    </Box>
                    <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }} gutterBottom fontWeight="bold">
                        Free Online Image Optimizer & Converter
                    </Typography>
                    <Typography variant="h2" sx={{ fontSize: { xs: '1.25rem', md: '1.75rem' }, mb: 2, fontWeight: 400 }} color="text.secondary">
                        Compress Images Up to 80% Without Quality Loss
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto', lineHeight: 1.8 }}>
                        Professional image optimization and format conversion tool. Reduce file size, convert JPG to PNG, PNG to WebP, and more.
                        Fast, secure, and completely free. No registration required. Perfect for bloggers, web developers, e-commerce stores, and content creators
                        who need to optimize images for faster website loading and better SEO performance.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/optimize')}
                            startIcon={<CompressIcon />}
                            aria-label="Start optimizing images for free"
                            sx={{ px: 4, py: 1.5 }}
                        >
                            Optimize Images Free Now
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/convert')}
                            startIcon={<TransformIcon />}
                            aria-label="Convert image format online"
                            sx={{ px: 4, py: 1.5 }}
                        >
                            Convert Image Format
                        </Button>
                    </Box>
                </Box>

                {/* Features */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                            <CardContent sx={{ textAlign: 'center', p: 4 }}>
                                <CompressIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" gutterBottom fontWeight="bold">
                                    Image Compression Online Free
                                </Typography>
                                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                    Reduce image file size by up to 80% without visible quality loss. Our advanced compression algorithms remove unnecessary metadata
                                    and optimize your JPG, PNG, and WebP images for faster website loading and improved SEO rankings.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                            <CardContent sx={{ textAlign: 'center', p: 4 }}>
                                <TransformIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" gutterBottom fontWeight="bold">
                                    PNG to JPG & WebP Converter
                                </Typography>
                                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                    Convert between JPG, PNG, WebP, GIF, BMP, and more formats instantly. Perfect for converting PNG to JPG for smaller file sizes,
                                    or JPG to WebP for modern web optimization. Maintain quality during conversion with our smart algorithms.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                            <CardContent sx={{ textAlign: 'center', p: 4 }}>
                                <ImageIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" gutterBottom fontWeight="bold">
                                    Batch Image Processing
                                </Typography>
                                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                    Process multiple images at once with our batch optimization feature. Upload up to 50 images simultaneously for registered users.
                                    Ideal for optimizing entire photo galleries, product images for e-commerce, or website assets in one go.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            {/* How It Works Section */}
            <HowItWorks />

            {/* FAQ Section */}
            <FAQSection />

            {/* Footer */}
            <Footer />
        </Box >
    )
}

export default HomePage
