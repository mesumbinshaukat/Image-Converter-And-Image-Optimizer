import { Container, Typography, Box, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Footer from '../components/Footer'

export default function AboutPage() {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container maxWidth="lg" sx={{ py: 8 }}>
                {/* Header Section */}
                <Box sx={{ mb: 8, textAlign: 'center' }}>
                    <Typography variant="h2" component="h1" gutterBottom sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 3
                    }}>
                        About Imgify
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
                        Your Go-To Free Online Image Optimizer and Converter
                    </Typography>
                </Box>

                {/* Core Mission & Features Grid */}
                <Grid container spacing={4} sx={{ mb: 8 }}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
                                    Core Mission
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Imgify provides a simple, free platform for optimizing and converting images online, helping users reduce file sizes without losing quality to improve website speed and performance.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom fontWeight="bold" color="secondary">
                                    Key Features
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Supports multiple formats like PNG, JPG, WebP, and AVIF; offers lossless and lossy compression options; no watermarks or limits on usage.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: '#10B981' }}>
                                    User Benefits
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Ideal for bloggers, web developers, and marketers seeking quick tools to enhance SEO through faster loading times, with evidence suggesting optimized images can boost site rankings by improving user experience.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: '#F59E0B' }}>
                                    Commitment to Quality
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    We prioritize user-friendly design and privacy, ensuring your images are processed securely and deleted after use.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Our Story Section */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h4" gutterBottom fontWeight="bold">Our Story</Typography>
                    <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                        Imgify was born from a passion for making digital tools accessible to everyone. Launched in 2025 by a team of tech enthusiasts at World of Tech, we recognized the growing need for efficient image management in an era where visual content dominates online spaces. Whether you're compressing JPEGs for a blog post or converting PNG to WebP for better web compatibility, our platform streamlines the process without requiring downloads or subscriptions.
                    </Typography>
                </Box>

                {/* Why Choose Imgify Section */}
                <Box sx={{ mb: 8, bgcolor: 'rgba(139, 92, 246, 0.05)', p: 4, borderRadius: 4 }}>
                    <Typography variant="h4" gutterBottom fontWeight="bold">Why Choose Imgify?</Typography>
                    <Typography variant="body1" paragraph color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                        In a crowded market of image compression tools, Imgify stands out as a completely free online image optimizer that doesn't compromise on speed or quality. Our algorithms are designed to achieve up to 90% file size reduction in lossy mode while maintaining visual integrity, drawing from industry standards in image processing. We focus on SEO-friendly outcomes, knowing that smaller images lead to faster page loads—a key factor in search engine algorithms.
                    </Typography>
                </Box>

                {/* Our Values */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>Our Values</Typography>
                    <Grid container spacing={3}>
                        {[
                            { title: 'Innovation', desc: 'Constantly updating our converter and optimizer to support emerging formats like AVIF.' },
                            { title: 'Accessibility', desc: 'Free for all users, with intuitive interfaces for beginners and pros alike.' },
                            { title: 'Sustainability', desc: 'By reducing file sizes, we help lower data usage and server loads, contributing to a greener web.' }
                        ].map((value) => (
                            <Grid item xs={12} md={4} key={value.title}>
                                <Box sx={{ p: 3, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, height: '100%' }}>
                                    <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">{value.title}</Typography>
                                    <Typography variant="body1" color="text.secondary">{value.desc}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Call to Action */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h5" gutterBottom>Ready to optimize your images?</Typography>
                    <Button
                        component={RouterLink}
                        to="/"
                        variant="contained"
                        size="large"
                        sx={{ mt: 2, px: 4, py: 1.5, fontSize: '1.1rem' }}
                    >
                        Start Compressing Today
                    </Button>
                </Box>

                <Box sx={{ my: 6 }}><hr style={{ opacity: 0.1 }} /></Box>

                {/* Additional Content Sections */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="body1" paragraph color="text.secondary">
                        Imgify is more than just a free online image optimizer and converter—it's a dedicated solution crafted to empower creators, developers, and businesses in managing their visual assets efficiently. In today's digital landscape, where high-quality images are essential for engaging content, the challenge often lies in balancing file size with performance. That's where Imgify steps in, offering seamless tools to compress images online, convert formats, and enhance overall web efficiency without any cost or complexity.
                    </Typography>
                </Box>

                <Grid container spacing={6} sx={{ mb: 8 }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">The Genesis of Imgify</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            Founded in early 2025 by a small team of software engineers and designers at World of Tech Company, Imgify emerged from a simple observation: many users struggle with bulky image files that slow down websites and consume bandwidth. Drawing inspiration from established tools in the image compression space, we aimed to create a platform that's not only powerful but also entirely free and user-centric. Our journey began with basic PNG to JPG conversions and has evolved to include advanced features like batch processing and support for next-gen formats such as WebP and AVIF. As of November 26, 2025, we've helped thousands of users reduce image sizes, contributing to faster-loading sites worldwide.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">Mission and Vision</Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                            At the heart of Imgify is a mission to democratize image optimization. We believe that everyone—from hobbyist bloggers to professional marketers—should have access to top-tier tools for reducing image file sizes online. Our vision extends beyond mere functionality; we strive to educate users on best practices for image SEO, such as using alt texts, descriptive file names, and compressed formats to improve search rankings. By integrating AI-driven enhancements, we ensure our content and tools align with AISEO principles, making them readable and valuable for both human users and search algorithms.
                        </Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mb: 8 }}>
                    <Typography variant="body1" paragraph color="text.secondary" sx={{ fontStyle: 'italic', borderLeft: '4px solid #8B5CF6', pl: 2 }}>
                        Research indicates that optimized images can reduce page load times by up to 30-50%, directly impacting bounce rates and SEO performance. Imgify's lossless compression preserves every pixel while shrinking files by 10-30%, and our lossy options push reductions to 70-95% with minimal quality loss—perfect for e-commerce sites or portfolios where visuals matter most.
                    </Typography>
                </Box>

                <Box sx={{ mb: 8 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">Our Team and Expertise</Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                        Behind Imgify is a diverse team of experts in web development, AI, and digital media. Our lead developer, with over a decade in image processing algorithms, ensures that every update incorporates the latest in compression technology. We collaborate with SEO specialists to embed best practices directly into our platform, such as automatic suggestions for keyword-optimized file names during conversions. Though we're a lean operation, our commitment to open-source principles allows community feedback to shape features, fostering innovation in online image converters.
                    </Typography>
                </Box>

                <Box sx={{ mb: 8 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">Core Features and How We Optimize for You</Typography>
                    <Typography variant="body1" paragraph color="text.secondary">Imgify isn't just about compression—it's a comprehensive suite for image management:</Typography>
                    <Grid container spacing={2}>
                        {[
                            { title: 'Image Optimizer', desc: 'Compress JPEG, PNG, GIF, and more online for free, with options for lossy or lossless modes to suit your needs.' },
                            { title: 'Image Converter', desc: 'Seamlessly switch between formats like PNG to JPG or to WebP, enhancing compatibility for modern browsers.' },
                            { title: 'Batch Processing', desc: 'Handle multiple files at once, ideal for web designers optimizing entire galleries.' },
                            { title: 'Privacy-Focused', desc: 'All uploads are processed in real-time and deleted immediately after, with no data storage.' }
                        ].map((feature) => (
                            <Grid item xs={12} sm={6} key={feature.title}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <CheckCircleIcon color="success" sx={{ mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">{feature.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">{feature.desc}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{ mb: 8 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">Values That Drive Us</Typography>
                    <Grid container spacing={2}>
                        {[
                            { title: 'Accessibility and Inclusivity', desc: 'As a free tool, Imgify removes barriers, supporting users globally regardless of technical expertise.' },
                            { title: 'Innovation Through AI', desc: 'Leveraging AI for smarter compression, we stay ahead of trends, ensuring our service evolves with user demands.' },
                            { title: 'Sustainability', desc: 'Smaller files mean less energy consumption in data transfers, aligning with eco-friendly web practices.' },
                            { title: 'User Trust', desc: 'Transparent policies on privacy and terms, building long-term relationships.' }
                        ].map((value) => (
                            <Grid item xs={12} sm={6} key={value.title}>
                                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" color="primary">{value.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{value.desc}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{ mb: 8 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">Looking Ahead</Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                        As we grow, Imgify plans to introduce API integrations for developers and advanced AI features like auto-format selection based on content type. We're committed to maintaining our free model while exploring premium add-ons for heavy users. Join our community by registering for updates or contacting us with feedback—your input shapes the future of online image optimization.
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                        Whether you're a small business owner fine-tuning product photos or a content creator streamlining social media assets, Imgify is here to make image handling effortless. Explore our tools today at <a href="https://imgify.worldoftech.company/" style={{ color: '#8B5CF6', textDecoration: 'none' }}>https://imgify.worldoftech.company/</a> and experience the difference in your web performance.
                    </Typography>
                </Box>

                {/* Optimization Strategies Table */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">Optimization Strategies Table</Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
                        To highlight how Imgify aligns with SEO and AISEO best practices, here's a breakdown:
                    </Typography>
                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.1)' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: 'rgba(139, 92, 246, 0.05)' }}>
                                <TableRow>
                                    <TableCell><strong>Aspect</strong></TableCell>
                                    <TableCell><strong>Description</strong></TableCell>
                                    <TableCell><strong>Benefit for Users</strong></TableCell>
                                    <TableCell><strong>SEO/AISEO Impact</strong></TableCell>
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
                                    <TableRow key={row.aspect}>
                                        <TableCell component="th" scope="row"><strong>{row.aspect}</strong></TableCell>
                                        <TableCell>{row.desc}</TableCell>
                                        <TableCell>{row.benefit}</TableCell>
                                        <TableCell>{row.impact}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>
            <Footer />
        </Box>
    );
}
