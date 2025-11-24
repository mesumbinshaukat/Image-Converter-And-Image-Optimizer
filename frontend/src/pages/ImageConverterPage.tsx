import { useState } from 'react'
import { Container, Typography, Box, Button, Paper, Alert, LinearProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import api from '../services/api'

function ImageConverterPage() {
    const [files, setFiles] = useState<File[]>([])
    const [format, setFormat] = useState('png')
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<any[]>([])
    const [error, setError] = useState('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files))
            setError('')
        }
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
        formData.append('format', format)
        formData.append('quality', '90')

        try {
            const response = await api.post('/convert', formData, {
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
            console.error('Conversion error:', err)
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to convert images')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
            <Container maxWidth="md">


                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Image Converter
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    Convert images between different formats
                </Typography>

                <Paper sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id="file-input"
                        />
                        <label htmlFor="file-input">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                size="large"
                            >
                                Select Images
                            </Button>
                        </label>
                        {files.length > 0 && (
                            <Typography sx={{ mt: 2 }}>
                                {files.length} file(s) selected
                            </Typography>
                        )}
                    </Box>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Target Format</InputLabel>
                        <Select
                            value={format}
                            label="Target Format"
                            onChange={(e) => setFormat(e.target.value)}
                        >
                            <MenuItem value="jpg">JPG</MenuItem>
                            <MenuItem value="png">PNG</MenuItem>
                            <MenuItem value="webp">WebP</MenuItem>
                            <MenuItem value="gif">GIF</MenuItem>
                            <MenuItem value="bmp">BMP</MenuItem>
                        </Select>
                    </FormControl>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleConvert}
                        disabled={loading || files.length === 0}
                    >
                        {loading ? 'Converting...' : 'Convert Images'}
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
                                                {result.original_format.toUpperCase()} → {result.converted_format.toUpperCase()}
                                            </Typography>
                                            <Typography>
                                                Size: {(result.original_size / 1024).toFixed(2)} KB → {(result.converted_size / 1024).toFixed(2)} KB
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

export default ImageConverterPage
