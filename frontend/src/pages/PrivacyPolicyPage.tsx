import { Container, Typography, Box, Button, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

function PrivacyPolicyPage() {
    const navigate = useNavigate()

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container maxWidth="md">
                <Button onClick={() => navigate('/')} sx={{ mb: 2 }}>← Back to Home</Button>

                <Paper sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        Privacy Policy
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 4 }}>
                        Last updated: November 27, 2025
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        1. Information We Collect
                    </Typography>
                    <Typography paragraph>
                        We collect the following information to provide and improve our services:
                    </Typography>
                    <Typography component="div" paragraph>
                        <strong>• IP Addresses:</strong> Used for rate limiting, abuse prevention, and analytics<br />
                        <strong>• Country Location:</strong> Derived from IP address for analytics purposes (country-level only, not precise location)<br />
                        <strong>• Uploaded Images:</strong> Temporarily stored for processing (optimization, conversion, background removal)<br />
                        <strong>• User Account Data:</strong> Email, username, and password (encrypted) for registered users<br />
                        <strong>• Usage Analytics:</strong> Page views, feature usage, processing times, and success rates<br />
                        <strong>• Contact Form Submissions:</strong> Name, email, and message content when you contact us
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        2. How We Use Your Information
                    </Typography>
                    <Typography component="div" paragraph>
                        <strong>• Process Images:</strong> Optimize, convert formats, and remove backgrounds from your images<br />
                        <strong>• Enforce Rate Limits:</strong> Prevent abuse and ensure fair usage for all users<br />
                        <strong>• Improve Services:</strong> Analyze usage patterns to enhance features and performance<br />
                        <strong>• Analytics:</strong> Track feature usage, success rates, and geographic distribution of traffic<br />
                        <strong>• Communication:</strong> Respond to contact form submissions and support requests<br />
                        <strong>• Security:</strong> Detect and prevent fraudulent or malicious activity
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        3. Data Storage and Retention
                    </Typography>
                    <Typography component="div" paragraph>
                        <strong>• Uploaded Images:</strong> Automatically deleted after 24 hours<br />
                        <strong>• Processing Analytics:</strong> Stored indefinitely in anonymized form<br />
                        <strong>• User Accounts:</strong> Retained until account deletion is requested<br />
                        <strong>• IP Addresses:</strong> Stored with analytics data, not linked to specific images after 24 hours<br />
                        <strong>• Country Data:</strong> Stored with analytics for traffic analysis
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        4. Background Removal Feature
                    </Typography>
                    <Typography paragraph>
                        Our AI-powered background removal feature processes images entirely in your browser using client-side technology.
                        While the processing happens on your device, we track analytics data (file size, processing time, success/failure)
                        to improve the service. No processed images are stored on our servers.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        5. Cookies and Tracking Technologies
                    </Typography>
                    <Typography component="div" paragraph>
                        We use cookies and similar technologies for:<br />
                        <strong>• Essential Cookies:</strong> Session management, authentication, and CSRF protection (required)<br />
                        <strong>• Analytics Cookies:</strong> Track page views, feature usage, and performance metrics (optional)<br />
                        <strong>• Marketing Cookies:</strong> Google AdSense for displaying relevant advertisements (optional)<br />
                        <br />
                        You can manage your cookie preferences through our cookie consent banner or your browser settings.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        6. Third-Party Services
                    </Typography>
                    <Typography component="div" paragraph>
                        <strong>• Google AdSense:</strong> We use Google AdSense to display advertisements. Google may collect data about your browsing
                        activity across websites. See Google's Privacy Policy for more information.<br />
                        <strong>• IP Geolocation:</strong> We use ipapi.co to determine country from IP addresses for analytics purposes.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        7. Data Sharing
                    </Typography>
                    <Typography paragraph>
                        We do not sell your personal information. We may share data with:
                    </Typography>
                    <Typography component="div" paragraph>
                        <strong>• Service Providers:</strong> Third-party services that help us operate (e.g., hosting, analytics)<br />
                        <strong>• Legal Requirements:</strong> When required by law or to protect our rights<br />
                        <strong>• Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        8. Your Rights
                    </Typography>
                    <Typography component="div" paragraph>
                        You have the right to:<br />
                        <strong>• Access:</strong> Request a copy of your personal data<br />
                        <strong>• Correction:</strong> Update or correct inaccurate information<br />
                        <strong>• Deletion:</strong> Request deletion of your account and associated data<br />
                        <strong>• Opt-Out:</strong> Disable analytics and marketing cookies<br />
                        <strong>• Data Portability:</strong> Receive your data in a structured format
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        9. Security
                    </Typography>
                    <Typography paragraph>
                        We implement industry-standard security measures to protect your data, including encryption,
                        secure connections (HTTPS), and regular security audits. However, no method of transmission
                        over the internet is 100% secure.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        10. Children's Privacy
                    </Typography>
                    <Typography paragraph>
                        Our service is not intended for children under 13. We do not knowingly collect personal
                        information from children. If you believe we have collected data from a child, please contact us.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        11. Changes to This Policy
                    </Typography>
                    <Typography paragraph>
                        We may update this Privacy Policy from time to time. We will notify you of significant changes
                        by posting the new policy on this page and updating the "Last updated" date.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        12. Contact Us
                    </Typography>
                    <Typography paragraph>
                        For privacy concerns, questions, or to exercise your rights, contact us at:<br />
                        <strong>Email:</strong> mesum@worldoftech.company<br />
                        <strong>Website:</strong> https://imgify.worldoftech.company
                    </Typography>
                </Paper>
            </Container>
            <Footer />
        </Box>
    )
}

export default PrivacyPolicyPage
