import { Container, Typography, Box, Button, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function TermsOfServicePage() {
    const navigate = useNavigate()

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
            <Container maxWidth="md">
                <Button onClick={() => navigate('/')} sx={{ mb: 2 }}>← Back to Home</Button>

                <Paper sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        Terms of Service
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 4 }}>
                        Last updated: November 23, 2024
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        1. Acceptance of Terms
                    </Typography>
                    <Typography paragraph>
                        By using Imgify, you agree to these terms of service.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        2. Usage Limits
                    </Typography>
                    <Typography paragraph>
                        - Guest users: 5 images per batch, 20 images per day<br />
                        - Registered users: 50 images per batch, 500 images per day
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        3. File Retention
                    </Typography>
                    <Typography paragraph>
                        Processed images are stored for 24 hours and then automatically deleted.
                        Please download your images within this timeframe.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        4. Prohibited Use
                    </Typography>
                    <Typography paragraph>
                        You may not use this service to process illegal content or attempt to abuse the service through automated means.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        5. Disclaimer
                    </Typography>
                    <Typography paragraph>
                        This service is provided "as is" without warranties. We are not liable for any data loss.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        6. Contact
                    </Typography>
                    <Typography paragraph>
                        For questions, contact: mesum@worldoftech.company
                    </Typography>
                </Paper>
            </Container>
        </Box>
    )
}

export default TermsOfServicePage
