import { useState, useCallback, useRef } from 'react'
import { removeBackground, Config } from '@imgly/background-removal'
import api from '../services/api'

interface ProcessedImage {
    original: File
    result: Blob | null
    preview: string
    loading: boolean
    error: string | null
}

export interface ProcessingStep {
    label: string
    status: 'pending' | 'active' | 'completed' | 'error'
    message?: string
    duration?: number
}

export const useBackgroundRemoval = () => {
    const [images, setImages] = useState<ProcessedImage[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([])
    const [currentStep, setCurrentStep] = useState(0)
    const [progress, setProgress] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [modalError, setModalError] = useState<string | null>(null)
    const abortControllerRef = useRef<AbortController | null>(null)
    const stepTimers = useRef<{ [key: string]: number }>({})

    const updateStep = useCallback((stepIndex: number, updates: Partial<ProcessingStep>) => {
        setProcessingSteps(prev => prev.map((step, i) =>
            i === stepIndex ? { ...step, ...updates } : step
        ))
    }, [])

    const trackAnalytics = useCallback(async (imageData: {
        filename: string
        originalSize: number
        processedSize: number
        processingTime: number
        success: boolean
        errorMessage?: string
    }) => {
        try {
            await api.post('/analytics/background-removal', imageData)
        } catch (error) {
            console.error('Failed to track analytics:', error)
        }
    }, [])

    const processImage = useCallback(async (file: File, index: number) => {
        const startTime = Date.now()

        try {
            // Initialize processing steps
            const steps: ProcessingStep[] = [
                { label: 'Initializing', status: 'pending', message: 'Preparing image for processing...' },
                { label: 'Loading AI Model', status: 'pending', message: 'Downloading background removal model...' },
                { label: 'Analyzing Image', status: 'pending', message: 'Detecting foreground and background...' },
                { label: 'Removing Background', status: 'pending', message: 'Processing image with AI...' },
                { label: 'Finalizing', status: 'pending', message: 'Creating transparent PNG...' },
            ]

            setProcessingSteps(steps)
            setCurrentStep(0)
            setProgress(0)
            setShowModal(true)
            setModalError(null)

            // Update loading state
            setImages(prev => prev.map((img, i) =>
                i === index ? { ...img, loading: true, error: null } : img
            ))

            // Step 1: Initializing
            stepTimers.current['init'] = Date.now()
            updateStep(0, { status: 'active' })
            setProgress(10)
            await new Promise(resolve => setTimeout(resolve, 500))
            updateStep(0, {
                status: 'completed',
                duration: (Date.now() - stepTimers.current['init']) / 1000
            })
            setCurrentStep(1)

            // Step 2: Loading AI Model
            stepTimers.current['model'] = Date.now()
            updateStep(1, { status: 'active', message: 'First-time load may take 10-15 seconds...' })
            setProgress(20)

            // Create abort controller for this operation
            abortControllerRef.current = new AbortController()

            const config: Config = {
                output: {
                    format: 'image/png',
                    quality: 1.0
                }
            }

            // Step 3: Analyzing Image
            setProgress(40)
            setCurrentStep(2)
            updateStep(1, {
                status: 'completed',
                duration: (Date.now() - stepTimers.current['model']) / 1000
            })
            stepTimers.current['analyze'] = Date.now()
            updateStep(2, { status: 'active' })

            // Step 4: Removing Background
            setProgress(60)
            setCurrentStep(3)
            updateStep(2, {
                status: 'completed',
                duration: (Date.now() - stepTimers.current['analyze']) / 1000
            })
            stepTimers.current['process'] = Date.now()
            updateStep(3, { status: 'active' })

            // Process the image
            const blob = await removeBackground(file, config)

            setProgress(90)
            updateStep(3, {
                status: 'completed',
                duration: (Date.now() - stepTimers.current['process']) / 1000
            })

            // Step 5: Finalizing
            setCurrentStep(4)
            stepTimers.current['finalize'] = Date.now()
            updateStep(4, { status: 'active' })

            // Create preview URL
            const previewUrl = URL.createObjectURL(blob)

            setProgress(100)
            updateStep(4, {
                status: 'completed',
                duration: (Date.now() - stepTimers.current['finalize']) / 1000
            })

            // Update with result
            setImages(prev => prev.map((img, i) =>
                i === index ? {
                    ...img,
                    result: blob as Blob,
                    preview: previewUrl,
                    loading: false
                } : img
            ))

            // Track analytics
            const processingTime = (Date.now() - startTime) / 1000
            await trackAnalytics({
                filename: file.name,
                originalSize: file.size,
                processedSize: blob.size,
                processingTime,
                success: true
            })

            // Close modal after brief delay
            setTimeout(() => {
                setShowModal(false)
            }, 1500)

        } catch (error: any) {
            console.error('Background removal error:', error)
            const errorMessage = error.message || 'Failed to remove background'

            setModalError(errorMessage)
            updateStep(currentStep, { status: 'error', message: errorMessage })

            setImages(prev => prev.map((img, i) =>
                i === index ? {
                    ...img,
                    loading: false,
                    error: errorMessage
                } : img
            ))

            // Track failed analytics
            const processingTime = (Date.now() - startTime) / 1000
            await trackAnalytics({
                filename: file.name,
                originalSize: file.size,
                processedSize: 0,
                processingTime,
                success: false,
                errorMessage
            })

            // Close modal after delay to show error
            setTimeout(() => {
                setShowModal(false)
            }, 3000)
        }
    }, [currentStep, updateStep, trackAnalytics])

    const addImages = useCallback((files: File[]) => {
        const newImages: ProcessedImage[] = files.map(file => ({
            original: file,
            result: null,
            preview: URL.createObjectURL(file),
            loading: false,
            error: null
        }))
        setImages(prev => [...prev, ...newImages])
        return newImages.length
    }, [])

    const processAll = useCallback(async () => {
        setIsProcessing(true)
        for (let i = 0; i < images.length; i++) {
            if (!images[i].result && !images[i].loading) {
                await processImage(images[i].original, i)
            }
        }
        setIsProcessing(false)
    }, [images, processImage])

    const removeImage = useCallback((index: number) => {
        setImages(prev => {
            const updated = [...prev]
            // Revoke object URLs to prevent memory leaks
            URL.revokeObjectURL(updated[index].preview)
            if (updated[index].result) {
                URL.revokeObjectURL(updated[index].preview)
            }
            updated.splice(index, 1)
            return updated
        })
    }, [])

    const clearAll = useCallback(() => {
        images.forEach(img => {
            URL.revokeObjectURL(img.preview)
        })
        setImages([])
        setIsProcessing(false)
    }, [images])

    const downloadImage = useCallback((index: number) => {
        const image = images[index]
        if (!image.result) return

        const url = URL.createObjectURL(image.result)
        const a = document.createElement('a')
        a.href = url
        a.download = `${image.original.name.split('.')[0]}_no_bg.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }, [images])

    const downloadAll = useCallback(() => {
        images.forEach((_, index) => {
            if (images[index].result) {
                setTimeout(() => downloadImage(index), index * 100)
            }
        })
    }, [images, downloadImage])

    return {
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
    }
}
