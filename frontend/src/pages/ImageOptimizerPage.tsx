import { useState } from 'react'
import { Container, Typography, Box, Button, Paper, Alert, LinearProgress } from '@mui/material'
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
        formData.append('quality', '85')

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
                                        ) : result.already_optimized ? (
                                            <>
                                                <Alert severity="info" sx={{ mt: 1, mb: 1 }}>
                                                    This image is already well-optimized! Compression savings: {result.compression_ratio || 0}%
                                                </Alert>
                                                <Typography>
                                                    Size: {((result.original_size || 0) / 1024).toFixed(2)} KB → {((result.optimized_size || 0) / 1024).toFixed(2)} KB
                                                </Typography>
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
                                        ) : (
                                            <>
                                                <Typography>
                                                    Size: {((result.original_size || 0) / 1024).toFixed(2)} KB → {((result.optimized_size || 0) / 1024).toFixed(2)} KB
                                                </Typography>
                                                <Typography color="success.main">
                                                    Saved: {result.compression_ratio || 0}%
                                                </Typography>
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
