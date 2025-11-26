import { Container, Typography, Box, Button, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

function TermsOfServicePage() {
    const navigate = useNavigate()

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container maxWidth="md">
                <Button onClick={() => navigate('/')} sx={{ mb: 2 }}>← Back to Home</Button>

                <Paper sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        Terms of Service
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 4 }}>
                        Last updated: November 27, 2025
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        1. Acceptance of Terms
                    </Typography>
                    <Typography paragraph>
                        By accessing and using Imgify ("the Service"), you agree to be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use the Service.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        2. Description of Service
                    </Typography>
                    <Typography paragraph>
                        Imgify provides free online image processing services including:
                    </Typography>
                    <Typography component="div" paragraph>
                        <strong>• Image Optimization:</strong> Compress images to reduce file size while maintaining quality<br />
                        <strong>• Image Conversion:</strong> Convert images between formats (JPG, PNG, WebP, GIF, BMP, AVIF)<br />
                        <strong>• Background Removal:</strong> AI-powered automatic background removal from images<br />
                        <strong>• Batch Processing:</strong> Process multiple images simultaneously
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        3. Usage Limits
                    </Typography>
                    <Typography component="div" paragraph>
                        To ensure fair usage for all users, we enforce the following limits:<br />
                        <br />
                        <strong>Guest Users (Not Registered):</strong><br />
                        • 5 images per batch<br />
                        • 20 images per day<br />
                        <br />
                        <strong>Registered Users:</strong><br />
                        • 50 images per batch<br />
                        • 500 images per day<br />
                        <br />
                        These limits are subject to change and may be adjusted based on server capacity and abuse prevention.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        4. File Retention and Deletion
                    </Typography>
                    <Typography paragraph>
                        All uploaded and processed images are automatically deleted after 24 hours. Please download your
                        processed images within this timeframe. We are not responsible for any data loss after the retention period.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        5. Acceptable Use Policy
                    </Typography>
                    <Typography paragraph>
                        You agree NOT to use the Service for:
                    </Typography>
                    <Typography component="div" paragraph>
                        • Processing illegal, obscene, or offensive content<br />
                        • Uploading copyrighted material without proper authorization<br />
                        • Attempting to abuse, hack, or disrupt the Service<br />
                        • Using automated tools or bots to circumvent usage limits<br />
                        • Processing malware, viruses, or malicious code<br />
                        • Violating any applicable laws or regulations
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        6. Background Removal Service
                    </Typography>
                    <Typography paragraph>
                        Our AI-powered background removal feature processes images in your browser using client-side technology.
                        While we strive for accuracy, we do not guarantee perfect results for all images. The quality of background
                        removal depends on image complexity, lighting, and subject clarity.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        7. Intellectual Property
                    </Typography>
                    <Typography component="div" paragraph>
                        <strong>Your Content:</strong> You retain all rights to images you upload. By using the Service, you grant us
                        a temporary license to process your images as necessary to provide the Service.<br />
                        <br />
                        <strong>Our Content:</strong> The Service, including its design, code, and features, is protected by copyright
                        and other intellectual property laws. You may not copy, modify, or distribute our code or content without permission.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        8. Service Availability
                    </Typography>
                    <Typography paragraph>
                        The Service is provided on a "best-effort" basis. We do not guarantee:
                    </Typography>
                    <Typography component="div" paragraph>
                        • Uninterrupted or error-free operation<br />
                        • Specific uptime or availability<br />
                        • Compatibility with all browsers or devices<br />
                        • Preservation of processed images beyond 24 hours<br />
                        <br />
                        We reserve the right to modify, suspend, or discontinue the Service at any time without notice.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        9. Disclaimer of Warranties
                    </Typography>
                    <Typography paragraph>
                        THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
                        LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO
                        NOT WARRANT THAT THE SERVICE WILL MEET YOUR REQUIREMENTS OR THAT RESULTS WILL BE ACCURATE OR RELIABLE.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        10. Limitation of Liability
                    </Typography>
                    <Typography paragraph>
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                        CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS, OR
                        BUSINESS INTERRUPTION ARISING FROM YOUR USE OF THE SERVICE.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        11. User Accounts
                    </Typography>
                    <Typography component="div" paragraph>
                        If you create an account:<br />
                        • You are responsible for maintaining the security of your account<br />
                        • You must provide accurate and complete information<br />
                        • You are responsible for all activities under your account<br />
                        • You must notify us immediately of any unauthorized access<br />
                        • We reserve the right to suspend or terminate accounts that violate these terms
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        12. Privacy and Data Protection
                    </Typography>
                    <Typography paragraph>
                        Your use of the Service is also governed by our Privacy Policy. We collect and process data as described
                        in the Privacy Policy, including IP addresses, country location (derived from IP), usage analytics, and
                        uploaded images (temporarily).
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        13. Third-Party Services
                    </Typography>
                    <Typography paragraph>
                        The Service may include advertisements from Google AdSense and other third-party services. We are not
                        responsible for the content, privacy practices, or terms of these third parties.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        14. Modifications to Terms
                    </Typography>
                    <Typography paragraph>
                        We reserve the right to modify these Terms of Service at any time. Significant changes will be communicated
                        by updating the "Last updated" date. Continued use of the Service after changes constitutes acceptance of
                        the new terms.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        15. Termination
                    </Typography>
                    <Typography paragraph>
                        We may terminate or suspend your access to the Service immediately, without prior notice, for any reason,
                        including violation of these Terms. Upon termination, your right to use the Service will cease immediately.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        16. Governing Law
                    </Typography>
                    <Typography paragraph>
                        These Terms shall be governed by and construed in accordance with applicable laws, without regard to
                        conflict of law provisions.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        17. Contact Information
                    </Typography>
                    <Typography paragraph>
                        For questions about these Terms of Service, contact us at:<br />
                        <strong>Email:</strong> mesum@worldoftech.company<br />
                        <strong>Website:</strong> https://imgify.worldoftech.company
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 4, fontStyle: 'italic' }}>
                        By using Imgify, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                    </Typography>
                </Paper>
            </Container>
            <Footer />
        </Box>
    )
}

export default TermsOfServicePage
