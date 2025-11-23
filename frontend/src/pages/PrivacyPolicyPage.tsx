import { Container, Typography, Box, Button, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function PrivacyPolicyPage() {
    const navigate = useNavigate()

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
            <Container maxWidth="md">
                <Button onClick={() => navigate('/')} sx={{ mb: 2 }}>← Back to Home</Button>

                <Paper sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        Privacy Policy
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 4 }}>
                        Last updated: November 23, 2024
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        1. Information We Collect
                    </Typography>
                    <Typography paragraph>
                        We collect IP addresses for rate limiting purposes and uploaded images for processing.
                        Images are automatically deleted after 24 hours.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        2. How We Use Your Information
                    </Typography>
                    <Typography paragraph>
                        - Process and optimize your images<br />
                        - Enforce rate limits to prevent abuse<br />
                        - Improve our services
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        3. Data Storage
                    </Typography>
                    <Typography paragraph>
                        All uploaded images are stored temporarily for 24 hours and then automatically deleted.
                        We do not permanently store your images.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        4. Cookies
                    </Typography>
                    <Typography paragraph>
                        We use cookies to maintain your session and preferences. You can disable cookies in your browser settings.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        5. Contact
                    </Typography>
                    <Typography paragraph>
                        For privacy concerns, contact us at: mesum@worldoftech.company
                    </Typography>
                </Paper>
            </Container>
        </Box>
    )
}

export default PrivacyPolicyPage
