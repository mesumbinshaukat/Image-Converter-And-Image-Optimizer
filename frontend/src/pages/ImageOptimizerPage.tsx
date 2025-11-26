import { useState } from 'react'
import { Container, Typography, Box, Button, Paper, Alert, LinearProgress, Slider, Tooltip, IconButton } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import api from '../services/api'
import DragDropUploader from '../components/DragDropUploader'
import Footer from '../components/Footer'
import { usePageTracking } from '../hooks/usePageTracking'

function ImageOptimizerPage() {
    usePageTracking()
    const [files, setFiles] = useState<File[]>([])
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<any[]>([])
    const [error, setError] = useState('')
    const [quality, setQuality] = useState(85)

    const handleFilesSelected = (selectedFiles: File[]) => {
        setFiles(selectedFiles)
        setError('')
    }

    const handleOptimize = async () => {
        if (files.length === 0) {
            setError('Please select images to optimize')
            return
        }

        setLoading(true)
        setError('')

        const formData = new FormData()
        files.forEach(file => {
            formData.append('images[]', file)
        })
        formData.append('quality', quality.toString())

        try {
            const response = await api.post('/optimize', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            // Validate response structure
            if (response.data && Array.isArray(response.data.results)) {
                setResults(response.data.results)
            } else {
                console.error('Invalid response format:', response.data)
                setError('Received invalid response from server')
            }
        } catch (err: any) {
            console.error('Optimization error:', err)
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to optimize images')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }} gutterBottom fontWeight="bold">
                            Free Image Optimizer - Compress JPG, PNG, WebP Online
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: 800, mx: 'auto', lineHeight: 1.7 }}>
                            Reduce image file size up to 80% without quality loss. Our advanced compression algorithms optimize JPG, JPEG, PNG, and WebP images
                            for faster website loading, better SEO rankings, and improved user experience. Perfect for bloggers, web developers, and e-commerce stores.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
                            Supported formats: JPG, JPEG, PNG, WebP, GIF, BMP • Batch processing • No watermarks • Free forever
                        </Typography>
                    </Box>

                    <Paper sx={{ p: 4 }}>
                        <DragDropUploader
                            onFilesSelected={handleFilesSelected}
                            maxFiles={50}
                            disabled={loading}
                        />

                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                        {/* Quality Slider */}
                        <Box sx={{ mb: 3, px: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Optimization Quality: {quality}%
                                </Typography>
                                <Tooltip title="Higher quality preserves more detail but results in larger files. Lower quality reduces file size more but may affect image quality. For already-optimized images, the original will be kept if optimization would increase size.">
                                    <IconButton size="small" sx={{ ml: 1 }}>
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Slider
                                value={quality}
                                onChange={(_, value) => setQuality(value as number)}
                                min={60}
                                max={100}
                                step={5}
                                marks={[
                                    { value: 60, label: '60%' },
                                    { value: 75, label: '75%' },
                                    { value: 85, label: '85%' },
                                    { value: 100, label: '100%' }
                                ]}
                                disabled={loading}
                                sx={{ mt: 1 }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Smaller file size
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Higher quality
                                </Typography>
                            </Box>
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handleOptimize}
                            disabled={loading || files.length === 0}
                            sx={{
                                color: 'white',
                                '&:hover': {
                                    color: 'white',
                                },
                            }}
                        >
                            {loading ? 'Optimizing...' : 'Optimize Images'}
                        </Button>

                        {loading && <LinearProgress sx={{ mt: 2 }} />}

                        {results.length > 0 && (
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h6" gutterBottom>Results:</Typography>
                                {results.map((result, index) => (
                                    <Paper key={index} sx={{ p: 2, mb: 2 }}>
                                        <Typography><strong>{result.filename}</strong></Typography>
                                        {result.error ? (
                                            <Typography color="error">{result.error}</Typography>
                                        ) : (
                                            <>
                                                <Typography>
                                                    Size: {(result.original_size / 1024).toFixed(2)} KB → {(result.optimized_size / 1024).toFixed(2)} KB
                                                </Typography>
                                                {result.used_original ? (
                                                    <Typography color="info.main" sx={{ fontStyle: 'italic' }}>
                                                        ✓ Original kept (already optimized)
                                                    </Typography>
                                                ) : (
                                                    <Typography color="success.main">
                                                        Saved: {result.compression_ratio}%
                                                    </Typography>
                                                )}
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    sx={{
                                                        mt: 1,
                                                        color: 'white',
                                                    }}
                                                    href={result.download_url}
                                                    download
                                                >
                                                    Download
                                                </Button>
                                            </>
                                        )}
                                    </Paper>
                                ))}
                            </Box>
                        )}
                    </Paper>
                </Container>
            </Box>
            <Footer />
        </>
    )
}

export default ImageOptimizerPage
