import { useState } from 'react'
import { Container, Typography, Box, Button, Paper, Alert, LinearProgress, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import api from '../services/api'
import DragDropUploader from '../components/DragDropUploader'
import Footer from '../components/Footer'
import { usePageTracking } from '../hooks/usePageTracking'

function ImageConverterPage() {
    usePageTracking()
    const [files, setFiles] = useState<File[]>([])
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<any[]>([])
    const [error, setError] = useState('')
    const [targetFormat, setTargetFormat] = useState('png')

    const handleFilesSelected = (selectedFiles: File[]) => {
        setFiles(selectedFiles)
        setError('')
    }

    const handleFormatChange = (event: SelectChangeEvent) => {
        setTargetFormat(event.target.value)
    }

    const handleConvert = async () => {
        if (files.length === 0) {
            setError('Please select images to convert')
            return
        }

        setLoading(true)
        setError('')

        const formData = new FormData()
        files.forEach(file => {
            formData.append('images[]', file)
        })
        formData.append('format', targetFormat)

        try {
            const response = await api.post('/convert', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            if (response.data && Array.isArray(response.data.results)) {
                setResults(response.data.results)
            } else {
                console.error('Invalid response format:', response.data)
                setError('Received invalid response from server')
            }
        } catch (err: any) {
            console.error('Conversion error:', err)
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to convert images')
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
                            Free Image Converter - PNG to JPG, WebP, AVIF Online
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: 800, mx: 'auto', lineHeight: 1.7 }}>
                            Convert images between formats instantly. Transform PNG to JPG for smaller files, JPG to WebP for modern web optimization,
                            or convert to AVIF for next-gen compression. Support for JPG, PNG, WebP, GIF, BMP, and more. Fast, free, and secure.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
                            Popular conversions: PNG to JPG • JPG to PNG • PNG to WebP • JPG to WebP • GIF to PNG • BMP to JPG
                        </Typography>
                    </Box>

                    <Paper sx={{ p: 4 }}>
                        <DragDropUploader
                            onFilesSelected={handleFilesSelected}
                            maxFiles={50}
                            disabled={loading}
                        />

                        <FormControl fullWidth sx={{ mt: 3 }}>
                            <InputLabel>Convert To</InputLabel>
                            <Select
                                value={targetFormat}
                                label="Convert To"
                                onChange={handleFormatChange}
                                disabled={loading}
                            >
                                <MenuItem value="jpg">JPG/JPEG</MenuItem>
                                <MenuItem value="png">PNG</MenuItem>
                                <MenuItem value="webp">WebP</MenuItem>
                                <MenuItem value="gif">GIF</MenuItem>
                                <MenuItem value="bmp">BMP</MenuItem>
                            </Select>
                        </FormControl>

                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handleConvert}
                            disabled={loading || files.length === 0}
                            sx={{
                                mt: 3,
                                color: 'white',
                                '&:hover': {
                                    color: 'white',
                                },
                            }}
                        >
                            {loading ? 'Converting...' : `Convert to ${targetFormat.toUpperCase()}`}
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
                                                    Converted to: {result.format.toUpperCase()}
                                                </Typography>
                                                <Typography>
                                                    Size: {(result.size / 1024).toFixed(2)} KB
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

export default ImageConverterPage
