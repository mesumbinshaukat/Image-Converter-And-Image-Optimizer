import { useState } from 'react'
import { Container, Typography, Box, Button, Paper, Alert, LinearProgress } from '@mui/material'
import api from '../services/api'
import DragDropUploader from '../components/DragDropUploader'

function ImageOptimizerPage() {
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
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
            <Container maxWidth="md">
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Image Optimizer
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    Compress images without losing quality
                </Typography>

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
                                            <Typography color="success.main">
                                                Saved: {result.compression_ratio}%
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{ mt: 1 }}
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
    )
}

export default ImageOptimizerPage
