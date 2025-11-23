import React, { useCallback, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

interface DragDropUploaderProps {
    onFilesSelected: (files: File[]) => void;
    maxFiles?: number;
    acceptedFormats?: string;
    disabled?: boolean;
}

export default function DragDropUploader({
    onFilesSelected,
    maxFiles = 50,
    acceptedFormats = 'image/*',
    disabled = false,
}: DragDropUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragging(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            if (disabled) return;

            const files = Array.from(e.dataTransfer.files).filter((file) =>
                file.type.startsWith('image/')
            );

            if (files.length > maxFiles) {
                alert(`Maximum ${maxFiles} files allowed`);
                return;
            }

            setSelectedFiles(files);
            onFilesSelected(files);
        },
        [disabled, maxFiles, onFilesSelected]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                const files = Array.from(e.target.files);

                if (files.length > maxFiles) {
                    alert(`Maximum ${maxFiles} files allowed`);
                    return;
                }

                setSelectedFiles(files);
                onFilesSelected(files);
            }
        },
        [maxFiles, onFilesSelected]
    );

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        onFilesSelected(newFiles);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <Box>
            <Paper
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={{
                    p: 4,
                    textAlign: 'center',
                    border: '2px dashed',
                    borderColor: isDragging ? 'primary.main' : 'grey.300',
                    bgcolor: isDragging ? 'action.hover' : 'background.paper',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: disabled ? 0.6 : 1,
                    '&:hover': {
                        borderColor: disabled ? 'grey.300' : 'primary.main',
                        bgcolor: disabled ? 'background.paper' : 'action.hover',
                    },
                }}
            >
                <input
                    type="file"
                    multiple
                    accept={acceptedFormats}
                    onChange={handleFileInput}
                    style={{ display: 'none' }}
                    id="file-upload-input"
                    disabled={disabled}
                />
                <label htmlFor="file-upload-input" style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
                    <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        {isDragging ? 'Drop files here' : 'Drag & drop images here'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        or click to browse
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Maximum {maxFiles} files • Supported: JPG, PNG, WebP, GIF, BMP
                    </Typography>
                </label>
            </Paper>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Selected Files ({selectedFiles.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {selectedFiles.map((file, index) => (
                            <Paper
                                key={index}
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    },
                                }}
                            >
                                <ImageIcon color="primary" />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" fontWeight="medium">
                                        {file.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatFileSize(file.size)}
                                    </Typography>
                                </Box>
                                <IconButton
                                    size="small"
                                    onClick={() => removeFile(index)}
                                    color="error"
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Paper>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
