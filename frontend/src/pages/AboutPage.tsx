import { Container, Typography, Box, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import PublicIcon from '@mui/icons-material/Public';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CompareIcon from '@mui/icons-material/Compare';
import CollectionsIcon from '@mui/icons-material/Collections';
import LockIcon from '@mui/icons-material/Lock';
import HandshakeIcon from '@mui/icons-material/Handshake';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import RecyclingIcon from '@mui/icons-material/Recycling';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import Footer from '../components/Footer'

export default function AboutPage() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
                {/* Header Section */}
                <Box sx={{ mb: { xs: 6, md: 10 }, textAlign: 'center' }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' },
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 3
                        }}
                    >
                        About Imgify
                    </Typography>
                    <Typography
                        variant="h5"
                        color="text.secondary"
                        sx={{
                            maxWidth: '800px',
                            mx: 'auto',
                            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                            fontWeight: 500
                        }}
                    >
                        Your Go-To Free Online Image Optimizer and Converter
                    </Typography>
                </Box>

                {/* Core Mission & Features Grid */}
                <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mb: { xs: 6, md: 10 } }}>
                    {[
                        {
                            title: 'Core Mission',
                            desc: 'Imgify provides a simple, free platform for optimizing and converting images online, helping users reduce file sizes without losing quality to improve website speed and performance.',
                            icon: <RocketLaunchIcon sx={{ fontSize: 40, color: 'white' }} />
                        },
                        {
                            title: 'Key Features',
                            desc: 'Supports multiple formats like PNG, JPG, WebP, and AVIF; offers lossless and lossy compression options; no watermarks or limits on usage.',
                            icon: <SpeedIcon sx={{ fontSize: 40, color: 'white' }} />
                        },
                        {
                            title: 'User Benefits',
                            desc: 'Ideal for bloggers, web developers, and marketers seeking quick tools to enhance SEO through faster loading times, with evidence suggesting optimized images can boost site rankings by improving user experience.',
                            icon: <EmojiObjectsIcon sx={{ fontSize: 40, color: 'white' }} />
                        },
                        {
                            title: 'Commitment to Quality',
                            desc: 'We prioritize user-friendly design and privacy, ensuring your images are processed securely and deleted after use.',
                            icon: <SecurityIcon sx={{ fontSize: 40, color: 'white' }} />
                        }
                    ].map((item, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    bgcolor: 'background.paper',
                                    borderRadius: 4,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                    transition: 'all 0.3s ease',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    '&:hover': {
                                        boxShadow: '0 12px 40px rgba(139, 92, 246, 0.15)',
                                        transform: 'translateY(-5px)',
                                        borderColor: 'primary.main',
                                        '& .icon-box': {
                                            transform: 'scale(1.1) rotate(5deg)',
                                            bgcolor: 'primary.light',
                                            color: 'white'
                                        }
                                    }
                                }}
                            >
                                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                                    <Box
                                        className="icon-box"
                                        sx={{
                                            width: 70,
                                            height: 70,
                                            borderRadius: '20px',
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 3,
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)'
                                        }}
                                    >
                                        {item.icon}
                                    </Box>
                                    <Typography variant="h5" gutterBottom fontWeight="800" color="text.primary" sx={{ mb: 2 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                        {item.desc}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Our Story Section */}
                <Paper
                    elevation={0}
                    sx={{
                        mb: { xs: 6, md: 10 },
                        p: { xs: 3, md: 5 },
                        bgcolor: 'background.paper',
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }}
                >
                    <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>Our Story</Typography>
                    <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.8 }}>
                        Imgify was born from a passion for making digital tools accessible to everyone. Launched in 2025 by a team of tech enthusiasts at World of Tech, we recognized the growing need for efficient image management in an era where visual content dominates online spaces. Whether you're compressing JPEGs for a blog post or converting PNG to WebP for better web compatibility, our platform streamlines the process without requiring downloads or subscriptions.
                    </Typography>
                </Paper>

                {/* Why Choose Imgify Section */}
                <Paper
                    elevation={0}
                    sx={{
                        mb: { xs: 6, md: 10 },
                        bgcolor: 'rgba(139, 92, 246, 0.04)',
                        p: { xs: 3, md: 5 },
                        borderRadius: 3,
                        border: '1px solid rgba(139, 92, 246, 0.1)',
                        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)'
                    }}
                >
                    <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>Why Choose Imgify?</Typography>
                    <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.8 }}>
                        In a crowded market of image compression tools, Imgify stands out as a completely free online image optimizer that doesn't compromise on speed or quality. Our algorithms are designed to achieve up to 90% file size reduction in lossy mode while maintaining visual integrity, drawing from industry standards in image processing. We focus on SEO-friendly outcomes, knowing that smaller images lead to faster page loads—a key factor in search engine algorithms.
                    </Typography>
                </Paper>

                {/* Our Values */}
                <Box sx={{ mb: { xs: 6, md: 10 } }}>
                    <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4, textAlign: 'center' }}>Our Values</Typography>
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        {[
                            { title: 'Innovation', desc: 'Constantly updating our converter and optimizer to support emerging formats like AVIF.', icon: <LightbulbIcon color="primary" fontSize="large" /> },
                            { title: 'Accessibility', desc: 'Free for all users, with intuitive interfaces for beginners and pros alike.', icon: <PublicIcon color="primary" fontSize="large" /> },
                            { title: 'Sustainability', desc: 'By reducing file sizes, we help lower data usage and server loads, contributing to a greener web.', icon: <RecyclingIcon color="primary" fontSize="large" /> }
                        ].map((value) => (
                            <Grid item xs={12} md={4} key={value.title}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 3, md: 4 },
                                        height: '100%',
                                        bgcolor: 'background.paper',
                                        borderRadius: 3,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.12)',
                                            transform: 'translateY(-4px)',
                                            borderColor: 'primary.light'
                                        }
                                    }}
                                >
                                    <Box sx={{ mb: 2 }}>{value.icon}</Box>
                                    <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>{value.title}</Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>{value.desc}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Call to Action */}
                <Paper
                    elevation={0}
                    sx={{
                        textAlign: 'center',
                        mb: { xs: 6, md: 10 },
                        p: { xs: 4, md: 6 },
                        bgcolor: 'background.paper',
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }}
                >
                    <Typography variant="h5" gutterBottom fontWeight="600" sx={{ mb: 3 }}>Ready to optimize your images?</Typography>
                    <Button
                        component={RouterLink}
                        to="/"
                        variant="contained"
                        size="large"
                        sx={{
                            mt: 2,
                            px: { xs: 3, md: 5 },
                            py: { xs: 1.5, md: 2 },
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
                            '&:hover': {
                                boxShadow: '0 6px 20px rgba(139, 92, 246, 0.5)',
                            }
                        }}
                    >
                        Start Compressing Today
                    </Button>
                </Paper>

                <Box sx={{ my: { xs: 6, md: 8 } }}>
                    <Box sx={{ height: '1px', bgcolor: 'divider', opacity: 0.3 }} />
                </Box>

                {/* Additional Content Sections */}
                <Paper
                    elevation={0}
                    sx={{
                        mb: { xs: 4, md: 6 },
                        p: { xs: 3, md: 4 },
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                    }}
                >
                    <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        Imgify is more than just a free online image optimizer and converter—it's a dedicated solution crafted to empower creators, developers, and businesses in managing their visual assets efficiently. In today's digital landscape, where high-quality images are essential for engaging content, the challenge often lies in balancing file size with performance. That's where Imgify steps in, offering seamless tools to compress images online, convert formats, and enhance overall web efficiency without any cost or complexity.
                    </Typography>
                </Paper>

                <Grid container spacing={{ xs: 4, md: 6 }} sx={{ mb: { xs: 6, md: 10 } }}>
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 3, md: 4 },
                                height: '100%',
                                bgcolor: 'background.paper',
                                borderRadius: 2,
                                boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                            }}
                        >
                            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>The Genesis of Imgify</Typography>
                            <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                Founded in early 2025 by a small team of software engineers and designers at World of Tech Company, Imgify emerged from a simple observation: many users struggle with bulky image files that slow down websites and consume bandwidth. Drawing inspiration from established tools in the image compression space, we aimed to create a platform that's not only powerful but also entirely free and user-centric. Our journey began with basic PNG to JPG conversions and has evolved to include advanced features like batch processing and support for next-gen formats such as WebP and AVIF. As of November 26, 2025, we've helped thousands of users reduce image sizes, contributing to faster-loading sites worldwide.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 3, md: 4 },
                                height: '100%',
                                bgcolor: 'background.paper',
                                borderRadius: 2,
                                boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                            }}
                        >
                            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>Mission and Vision</Typography>
                            <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                At the heart of Imgify is a mission to democratize image optimization. We believe that everyone—from hobbyist bloggers to professional marketers—should have access to top-tier tools for reducing image file sizes online. Our vision extends beyond mere functionality; we strive to educate users on best practices for image SEO, such as using alt texts, descriptive file names, and compressed formats to improve search rankings. By integrating AI-driven enhancements, we ensure our content and tools align with AISEO principles, making them readable and valuable for both human users and search algorithms.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Paper
                    elevation={0}
                    sx={{
                        mb: { xs: 6, md: 10 },
                        p: { xs: 3, md: 4 },
                        bgcolor: 'rgba(139, 92, 246, 0.04)',
                        borderRadius: 2,
                        borderLeft: '4px solid #8B5CF6',
                        boxShadow: '0 2px 12px rgba(139, 92, 246, 0.08)'
                    }}
                >
                    <Typography variant="body1" paragraph color="text.secondary" sx={{ fontStyle: 'italic', lineHeight: 1.8, m: 0 }}>
                        Research indicates that optimized images can reduce page load times by up to 30-50%, directly impacting bounce rates and SEO performance. Imgify's lossless compression preserves every pixel while shrinking files by 10-30%, and our lossy options push reductions to 70-95% with minimal quality loss—perfect for e-commerce sites or portfolios where visuals matter most.
                    </Typography>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        mb: { xs: 6, md: 10 },
                        p: { xs: 3, md: 5 },
                        bgcolor: 'background.paper',
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }}
                >
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>Our Team and Expertise</Typography>
                    <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.8, m: 0 }}>
                        Behind Imgify is a diverse team of experts in web development, AI, and digital media. Our lead developer, with over a decade in image processing algorithms, ensures that every update incorporates the latest in compression technology. We collaborate with SEO specialists to embed best practices directly into our platform, such as automatic suggestions for keyword-optimized file names during conversions. Though we're a lean operation, our commitment to open-source principles allows community feedback to shape features, fostering innovation in online image converters.
                    </Typography>
                </Paper>

                <Box sx={{ mb: { xs: 6, md: 10 } }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 4, textAlign: 'center' }}>Core Features and How We Optimize for You</Typography>
                    <Typography variant="body1" paragraph color="text.secondary" sx={{ mb: 4, lineHeight: 1.8, textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>Imgify isn't just about compression—it's a comprehensive suite for image management:</Typography>
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        {[
                            { title: 'Image Optimizer', desc: 'Compress JPEG, PNG, GIF, and more online for free, with options for lossy or lossless modes to suit your needs.', icon: <AutoFixHighIcon color="primary" /> },
                            { title: 'Image Converter', desc: 'Seamlessly switch between formats like PNG to JPG or to WebP, enhancing compatibility for modern browsers.', icon: <CompareIcon color="primary" /> },
                            { title: 'Batch Processing', desc: 'Handle multiple files at once, ideal for web designers optimizing entire galleries.', icon: <CollectionsIcon color="primary" /> },
                            { title: 'Privacy-Focused', desc: 'All uploads are processed in real-time and deleted immediately after, with no data storage.', icon: <LockIcon color="primary" /> }
                        ].map((feature) => (
                            <Grid item xs={12} sm={6} key={feature.title}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        bgcolor: 'background.paper',
                                        borderRadius: 3,
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                        transition: 'all 0.3s ease',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        '&:hover': {
                                            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)',
                                            borderColor: 'primary.main',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.50', color: 'primary.main' }}>
                                            {feature.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>{feature.title}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{feature.desc}</Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{ mb: { xs: 6, md: 10 } }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 4, textAlign: 'center' }}>Values That Drive Us</Typography>
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        {[
                            { title: 'Accessibility and Inclusivity', desc: 'As a free tool, Imgify removes barriers, supporting users globally regardless of technical expertise.', icon: <HandshakeIcon /> },
                            { title: 'Innovation Through AI', desc: 'Leveraging AI for smarter compression, we stay ahead of trends, ensuring our service evolves with user demands.', icon: <PsychologyIcon /> },
                            { title: 'Sustainability', desc: 'Smaller files mean less energy consumption in data transfers, aligning with eco-friendly web practices.', icon: <RecyclingIcon /> },
                            { title: 'User Trust', desc: 'Transparent policies on privacy and terms, building long-term relationships.', icon: <VerifiedUserIcon /> }
                        ].map((value) => (
                            <Grid item xs={12} sm={6} key={value.title}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 2.5, md: 3 },
                                        bgcolor: 'background.paper',
                                        borderRadius: 3,
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                        height: '100%',
                                        transition: 'all 0.3s ease',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        '&:hover': {
                                            boxShadow: '0 6px 20px rgba(139, 92, 246, 0.1)',
                                            borderColor: 'primary.main',
                                            '& .value-icon': { color: 'primary.main' }
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                                        <Box className="value-icon" sx={{ color: 'text.secondary', transition: 'color 0.3s' }}>
                                            {value.icon}
                                        </Box>
                                        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">{value.title}</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{value.desc}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        mb: { xs: 6, md: 10 },
                        p: { xs: 3, md: 5 },
                        bgcolor: 'background.paper',
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }}
                >
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>Looking Ahead</Typography>
                    <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        As we grow, Imgify plans to introduce API integrations for developers and advanced AI features like auto-format selection based on content type. We're committed to maintaining our free model while exploring premium add-ons for heavy users. Join our community by registering for updates or contacting us with feedback—your input shapes the future of online image optimization.
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.8, m: 0 }}>
                        Whether you're a small business owner fine-tuning product photos or a content creator streamlining social media assets, Imgify is here to make image handling effortless. Explore our tools today at <a href="https://imgify.worldoftech.company/" style={{ color: '#8B5CF6', textDecoration: 'none', fontWeight: 500 }}>https://imgify.worldoftech.company/</a> and experience the difference in your web performance.
                    </Typography>
                </Paper>

                {/* Optimization Strategies Table */}
                <Box sx={{ mb: { xs: 6, md: 8 } }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>Optimization Strategies Table</Typography>
                    <Typography variant="body1" paragraph color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
                        To highlight how Imgify aligns with SEO and AISEO best practices, here's a breakdown:
                    </Typography>
                    <Box
                        sx={{
                            position: 'relative',
                            p: '2px', // Width of the border
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: '0 8px 30px rgba(139, 92, 246, 0.25)',
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={{
                                borderRadius: 2.5, // Slightly less than outer to fit
                                overflow: 'hidden',
                                bgcolor: 'background.paper'
                            }}
                        >
                            <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
                                <TableHead sx={{ bgcolor: 'rgba(139, 92, 246, 0.08)' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', md: '1rem' }, color: 'primary.main' }}>Aspect</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', md: '1rem' }, color: 'primary.main' }}>Description</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', md: '1rem' }, color: 'primary.main' }}>Benefit for Users</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', md: '1rem' }, color: 'primary.main' }}>SEO/AISEO Impact</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {[
                                        { aspect: 'Keyword Integration', desc: 'Natural use of terms like "free online image optimizer" in headings and text.', benefit: 'Easier discovery via search queries.', impact: 'Improves rankings; AI tools favor semantic relevance.' },
                                        { aspect: 'Content Structure', desc: 'Headings (H2, H3), lists, and tables for readability.', benefit: 'Enhances user engagement.', impact: 'Boosts crawlability and scannability for search engines.' },
                                        { aspect: 'Length and Depth', desc: '800+ words with detailed sections.', benefit: 'Provides comprehensive value.', impact: 'Signals authority to algorithms; ideal for 300-500+ word pages.' },
                                        { aspect: 'Visuals and Media', desc: 'Recommendations for images/examples (e.g., compression demos).', benefit: 'Builds trust visually.', impact: 'Supports multimedia SEO; AI optimizers like quotes/data.' },
                                        { aspect: 'Calls to Action', desc: 'Links to homepage, contact, and tools.', benefit: 'Drives conversions.', impact: 'Encourages internal linking for better site flow.' },
                                        { aspect: 'Trust Signals', desc: 'Mission, values, privacy mentions.', benefit: 'Fosters credibility.', impact: 'Enhances E-A-T (Expertise, Authoritativeness, Trustworthiness).' },
                                    ].map((row) => (
                                        <TableRow
                                            key={row.aspect}
                                            sx={{
                                                '&:nth-of-type(odd)': { bgcolor: 'rgba(0,0,0,0.02)' },
                                                '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.04)' },
                                                transition: 'background-color 0.2s'
                                            }}
                                        >
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: { xs: '0.813rem', md: '0.875rem' } }}>{row.aspect}</TableCell>
                                            <TableCell sx={{ fontSize: { xs: '0.813rem', md: '0.875rem' } }}>{row.desc}</TableCell>
                                            <TableCell sx={{ fontSize: { xs: '0.813rem', md: '0.875rem' } }}>{row.benefit}</TableCell>
                                            <TableCell sx={{ fontSize: { xs: '0.813rem', md: '0.875rem' } }}>{row.impact}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Container>
            <Footer />
        </Box>
    );
}
