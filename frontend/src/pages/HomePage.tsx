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
                    <Typography variant="h2" gutterBottom fontWeight="bold">
                        Image Optimizer & Converter
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
                        Compress and convert images without losing quality
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/optimize')}
                            startIcon={<CompressIcon />}
                        >
                            Optimize Images
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/convert')}
                            startIcon={<TransformIcon />}
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
