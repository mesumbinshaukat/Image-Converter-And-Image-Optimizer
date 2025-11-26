import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    LinearProgress,
    Stepper,
    Step,
    StepLabel,
    CircularProgress,
    Alert
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import ErrorIcon from '@mui/icons-material/Error'

interface ProcessingStep {
    label: string
    status: 'pending' | 'active' | 'completed' | 'error'
    message?: string
    duration?: number
}

interface ProcessingModalProps {
    open: boolean
    steps: ProcessingStep[]
    currentStep: number
    progress: number
    error?: string | null
}

export default function ProcessingModal({ open, steps, currentStep, progress, error }: ProcessingModalProps) {
    const getStepIcon = (status: ProcessingStep['status']) => {
        switch (status) {
            case 'completed':
                return <CheckCircleIcon sx={{ color: 'success.main' }} />
            case 'active':
                return <CircularProgress size={24} />
            case 'error':
                return <ErrorIcon sx={{ color: 'error.main' }} />
            default:
                return <HourglassEmptyIcon sx={{ color: 'action.disabled' }} />
        }
    }

    return (
        <Dialog
            open={open}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                }
            }}
        >
            <DialogContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Processing Your Image
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Please wait while we remove the background...
                    </Typography>
                </Box>

                {error ? (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                ) : (
                    <>
                        {/* Progress Bar */}
                        <Box sx={{ mb: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" fontWeight="500">
                                    Overall Progress
                                </Typography>
                                <Typography variant="body2" fontWeight="500">
                                    {Math.round(progress)}%
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 4,
                                        bgcolor: 'white',
                                    }
                                }}
                            />
                        </Box>

                        {/* Steps */}
                        <Box sx={{
                            bgcolor: 'rgba(255,255,255,0.1)',
                            borderRadius: 2,
                            p: 3,
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Stepper activeStep={currentStep} orientation="vertical">
                                {steps.map((step) => (
                                    <Step key={step.label} completed={step.status === 'completed'}>
                                        <StepLabel
                                            StepIconComponent={() => getStepIcon(step.status)}
                                            sx={{
                                                '& .MuiStepLabel-label': {
                                                    color: 'white',
                                                    fontWeight: step.status === 'active' ? 600 : 400,
                                                }
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="body1" fontWeight={step.status === 'active' ? 600 : 400}>
                                                    {step.label}
                                                </Typography>
                                                {step.message && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: 'rgba(255,255,255,0.7)',
                                                            display: 'block',
                                                            mt: 0.5
                                                        }}
                                                    >
                                                        {step.message}
                                                    </Typography>
                                                )}
                                                {step.duration && step.status === 'completed' && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: 'rgba(255,255,255,0.6)',
                                                            display: 'block',
                                                            mt: 0.5
                                                        }}
                                                    >
                                                        Completed in {step.duration}s
                                                    </Typography>
                                                )}
                                            </Box>
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>

                        {/* Helpful Tip */}
                        <Box sx={{
                            mt: 3,
                            p: 2,
                            bgcolor: 'rgba(255,255,255,0.1)',
                            borderRadius: 2,
                            borderLeft: '4px solid white'
                        }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                💡 <strong>Tip:</strong> First-time processing may take 10-15 seconds as the AI model downloads.
                                Subsequent images will be much faster!
                            </Typography>
                        </Box>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
