import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Download';

const steps = [
    {
        icon: <CloudUploadIcon sx={{ fontSize: 48 }} />,
        title: "Upload Your Images",
        description: "Drag and drop your JPG, PNG, WebP, or GIF images, or click to browse. Support for batch processing up to 50 images at once for registered users."
    },
    {
        icon: <SettingsIcon sx={{ fontSize: 48 }} />,
        title: "Automatic Optimization",
        description: "Our advanced algorithms compress your images up to 80% while maintaining visual quality. Choose between lossless compression or convert to modern formats like WebP for maximum savings."
    },
    {
        icon: <DownloadIcon sx={{ fontSize: 48 }} />,
        title: "Download Instantly",
        description: "Download your optimized images immediately. Files are processed in seconds and automatically deleted after 24 hours for your privacy and security."
    }
];

export default function HowItWorks() {
    return (
        <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h2" component="h2" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
                        How It Works
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                        Optimize and convert your images in three simple steps. No registration required for basic use.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {steps.map((step, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Paper
                                sx={{
                                    p: 4,
                                    height: '100%',
                                    textAlign: 'center',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4,
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        mb: 3,
                                    }}
                                >
                                    {step.icon}
                                </Box>
                                <Typography variant="h5" gutterBottom fontWeight="bold">
                                    Step {index + 1}
                                </Typography>
                                <Typography variant="h6" gutterBottom color="primary">
                                    {step.title}
                                </Typography>
                                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                    {step.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ mt: 6, p: 4, bgcolor: 'white', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        Why Choose Our Image Optimizer?
                    </Typography>
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                                100% Free
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                No hidden costs or subscriptions
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                                Fast Processing
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Instant results in seconds
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                                Secure & Private
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Files deleted after 24 hours
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                                No Watermarks
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Use images commercially
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
