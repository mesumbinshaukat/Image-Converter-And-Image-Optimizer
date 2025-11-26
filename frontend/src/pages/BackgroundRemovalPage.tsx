import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    Alert,
    LinearProgress,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    IconButton,
    Chip,
    Stack,
    Tooltip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import DragDropUploader from '../components/DragDropUploader'
import ProcessingModal from '../components/ProcessingModal'
import Footer from '../components/Footer'
import { usePageTracking } from '../hooks/usePageTracking'
import { useBackgroundRemoval } from '../hooks/useBackgroundRemoval'

function BackgroundRemovalPage() {
    usePageTracking()
    const {
        images,
        isProcessing,
        processingSteps,
        currentStep,
        progress,
        showModal,
        modalError,
        addImages,
        processImage,
        processAll,
        removeImage,
        clearAll,
        downloadImage,
        downloadAll
    } = useBackgroundRemoval()

    const handleFilesSelected = (selectedFiles: File[]) => {
        addImages(selectedFiles)
    }

    const handleProcessAll = async () => {
        await processAll()
    }

    const processedCount = images.filter(img => img.result !== null).length
    const hasProcessedImages = processedCount > 0

    return (
        <>
            {/* Processing Modal */}
            <ProcessingModal
                open={showModal}
                steps={processingSteps}
                currentStep={currentStep}
                progress={progress}
                error={modalError}
            />

            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography
                            variant="h1"
                            sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}
                            gutterBottom
                            fontWeight="bold"
                        >
                            Free AI Background Remover - Remove Image Background Online
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 2, maxWidth: 800, mx: 'auto', lineHeight: 1.7 }}
                        >
                            Remove backgrounds from images automatically using advanced AI technology.
                            Get professional results in seconds with our free background removal tool.
                            Perfect for product photos, portraits, profile pictures, and e-commerce images.
                            Download transparent PNG files instantly.
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 3, fontStyle: 'italic' }}
                        >
                            100% Free • AI-Powered • Instant Results • No Watermarks • Transparent PNG Export
                        </Typography>
                    </Box>

                    <Paper sx={{ p: 4, mb: 4 }}>
                        <DragDropUploader
                            onFilesSelected={handleFilesSelected}
                            maxFiles={10}
                            disabled={isProcessing}
                        />

                        {images.length > 0 && (
                            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleProcessAll}
                                    disabled={isProcessing || processedCount === images.length}
                                    startIcon={<AutoFixHighIcon />}
                                    sx={{
                                        flex: 1,
                                        color: 'white',
                                        '&:hover': {
                                            color: 'white',
                                        },
                                    }}
                                >
                                    {isProcessing ? 'Processing...' : 'Remove All Backgrounds'}
                                </Button>

                                {hasProcessedImages && (
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={downloadAll}
                                        startIcon={<DownloadIcon />}
                                    >
                                        Download All
                                    </Button>
                                )}

                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={clearAll}
                                    startIcon={<DeleteSweepIcon />}
                                    color="error"
                                >
                                    Clear All
                                </Button>
                            </Stack>
                        )}

                        {isProcessing && <LinearProgress sx={{ mt: 2 }} />}
                    </Paper>

                    {images.length > 0 && (
                        <Grid container spacing={3}>
                            {images.map((image, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative'
                                        }}
                                    >
                                        <Box sx={{ position: 'relative', paddingTop: '100%' }}>
                                            <CardMedia
                                                component="img"
                                                image={image.result ? URL.createObjectURL(image.result) : image.preview}
                                                alt={image.original.name}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    bgcolor: image.result ?
                                                        'repeating-conic-gradient(#f0f0f0 0% 25%, #ffffff 0% 50%) 50% / 20px 20px' :
                                                        'background.paper'
                                                }}
                                            />
                                            {image.loading && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        bgcolor: 'rgba(0,0,0,0.5)',
                                                    }}
                                                >
                                                    <LinearProgress sx={{ width: '80%' }} />
                                                </Box>
                                            )}
                                        </Box>

                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="body2" noWrap title={image.original.name}>
                                                {image.original.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {(image.original.size / 1024).toFixed(2)} KB
                                            </Typography>

                                            {image.result && (
                                                <Chip
                                                    label="Background Removed"
                                                    color="success"
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                />
                                            )}

                                            {image.error && (
                                                <Alert severity="error" sx={{ mt: 1 }}>
                                                    {image.error}
                                                </Alert>
                                            )}
                                        </CardContent>

                                        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                            {!image.result && !image.loading && (
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    onClick={() => processImage(image.original, index)}
                                                    startIcon={<AutoFixHighIcon />}
                                                    sx={{ color: 'white' }}
                                                >
                                                    Remove BG
                                                </Button>
                                            )}

                                            {image.result && (
                                                <Tooltip title="Download PNG">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => downloadImage(index)}
                                                    >
                                                        <DownloadIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            <Box sx={{ flexGrow: 1 }} />

                                            <Tooltip title="Remove">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* SEO Content Section */}
                    <Box sx={{ mt: 6 }}>
                        <Paper sx={{ p: 4 }}>
                            <Typography variant="h2" sx={{ fontSize: '1.75rem', mb: 2 }} fontWeight="bold">
                                How to Remove Background from Images
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Our AI-powered background remover makes it easy to remove backgrounds from any image:
                            </Typography>
                            <Box component="ol" sx={{ pl: 2 }}>
                                <Typography component="li" variant="body1" paragraph>
                                    <strong>Upload Your Image:</strong> Click or drag and drop your image (JPG, PNG, WebP supported)
                                </Typography>
                                <Typography component="li" variant="body1" paragraph>
                                    <strong>AI Processing:</strong> Our advanced AI automatically detects and removes the background
                                </Typography>
                                <Typography component="li" variant="body1" paragraph>
                                    <strong>Download:</strong> Get your transparent PNG file instantly, ready to use
                                </Typography>
                            </Box>

                            <Typography variant="h3" sx={{ fontSize: '1.5rem', mt: 4, mb: 2 }} fontWeight="bold">
                                Why Use Our Background Remover?
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" paragraph>
                                        <strong>✓ 100% Free:</strong> No hidden costs or subscriptions
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        <strong>✓ AI-Powered:</strong> Advanced machine learning for precise results
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        <strong>✓ Instant Results:</strong> Process images in seconds
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1" paragraph>
                                        <strong>✓ No Watermarks:</strong> Clean, professional output
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        <strong>✓ Privacy First:</strong> All processing happens in your browser
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        <strong>✓ Batch Processing:</strong> Remove backgrounds from multiple images
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Typography variant="h3" sx={{ fontSize: '1.5rem', mt: 4, mb: 2 }} fontWeight="bold">
                                Perfect For
                            </Typography>
                            <Typography variant="body1" paragraph>
                                • <strong>E-commerce:</strong> Product photos with clean, white backgrounds<br />
                                • <strong>Social Media:</strong> Profile pictures and content creation<br />
                                • <strong>Marketing:</strong> Professional graphics and advertisements<br />
                                • <strong>Design:</strong> Graphic design projects and presentations<br />
                                • <strong>Photography:</strong> Portrait editing and photo manipulation
                            </Typography>
                        </Paper>
                    </Box>
                </Container>
            </Box>
            <Footer />
        </>
    )
}

export default BackgroundRemovalPage
