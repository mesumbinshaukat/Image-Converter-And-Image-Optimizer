import { useState, useEffect } from 'react';
import { Box, Button, Typography, Link, IconButton, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CookieIcon from '@mui/icons-material/Cookie';

interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true, // Always true
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            // Show banner after 2 seconds
            setTimeout(() => setShowBanner(true), 2000);
        } else {
            const savedPreferences = JSON.parse(consent);
            setPreferences(savedPreferences);
        }
    }, []);

    const handleAcceptAll = () => {
        const allAccepted = {
            necessary: true,
            analytics: true,
            marketing: true,
        };
        localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        setPreferences(allAccepted);
        setShowBanner(false);
        setShowPreferences(false);
    };

    const handleRejectAll = () => {
        const onlyNecessary = {
            necessary: true,
            analytics: false,
            marketing: false,
        };
        localStorage.setItem('cookieConsent', JSON.stringify(onlyNecessary));
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        setPreferences(onlyNecessary);
        setShowBanner(false);
        setShowPreferences(false);
    };

    const handleSavePreferences = () => {
        localStorage.setItem('cookieConsent', JSON.stringify(preferences));
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        setShowBanner(false);
        setShowPreferences(false);
    };

    const handleManagePreferences = () => {
        setShowPreferences(true);
    };

    if (!showBanner) return null;

    return (
        <>
            <Slide direction="up" in={showBanner} mountOnEnter unmountOnExit>
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: 'background.paper',
                        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
                        p: 3,
                        zIndex: 9999,
                        borderTop: '3px solid',
                        borderColor: 'primary.main',
                    }}
                >
                    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <CookieIcon sx={{ fontSize: 40, color: 'primary.main', mt: 0.5 }} />

                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" gutterBottom fontWeight="bold">
                                    We Value Your Privacy
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                                    By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or learn more in our{' '}
                                    <Link href="/privacy-policy" underline="hover" color="primary">
                                        Privacy Policy
                                    </Link>.
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleAcceptAll}
                                        size="large"
                                    >
                                        Accept All
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={handleRejectAll}
                                        size="large"
                                    >
                                        Reject All
                                    </Button>
                                    <Button
                                        variant="text"
                                        onClick={handleManagePreferences}
                                        size="large"
                                    >
                                        Manage Preferences
                                    </Button>
                                </Box>
                            </Box>

                            <IconButton
                                onClick={() => setShowBanner(false)}
                                size="small"
                                sx={{ mt: -1 }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Slide>

            {/* Preferences Modal */}
            {showPreferences && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10000,
                        p: 2,
                    }}
                    onClick={() => setShowPreferences(false)}
                >
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            p: 4,
                            maxWidth: 600,
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h5" fontWeight="bold">
                                Cookie Preferences
                            </Typography>
                            <IconButton onClick={() => setShowPreferences(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            We use different types of cookies to optimize your experience on our website.
                            Click on the categories below to learn more and customize your preferences.
                        </Typography>

                        {/* Necessary Cookies */}
                        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Necessary Cookies
                                </Typography>
                                <Typography variant="body2" color="success.main" fontWeight="bold">
                                    Always Active
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                These cookies are essential for the website to function properly. They enable basic features like page navigation and access to secure areas.
                            </Typography>
                        </Box>

                        {/* Analytics Cookies */}
                        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Analytics Cookies
                                </Typography>
                                <Button
                                    variant={preferences.analytics ? 'contained' : 'outlined'}
                                    size="small"
                                    onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                                >
                                    {preferences.analytics ? 'Enabled' : 'Disabled'}
                                </Button>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                            </Typography>
                        </Box>

                        {/* Marketing Cookies */}
                        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Marketing Cookies
                                </Typography>
                                <Button
                                    variant={preferences.marketing ? 'contained' : 'outlined'}
                                    size="small"
                                    onClick={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
                                >
                                    {preferences.marketing ? 'Enabled' : 'Disabled'}
                                </Button>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                These cookies are used to track visitors across websites to display relevant advertisements and measure campaign effectiveness.
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button variant="outlined" onClick={() => setShowPreferences(false)}>
                                Cancel
                            </Button>
                            <Button variant="contained" onClick={handleSavePreferences}>
                                Save Preferences
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
        </>
    );
}
