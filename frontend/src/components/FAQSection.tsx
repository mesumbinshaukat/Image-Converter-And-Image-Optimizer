import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Container,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: "How does image optimization work?",
        answer: "Our image optimizer uses advanced compression algorithms to reduce file size while maintaining visual quality. It removes unnecessary metadata, optimizes color palettes, and applies lossless or near-lossless compression techniques to achieve up to 80% file size reduction without noticeable quality loss."
    },
    {
        question: "What's the difference between JPG, PNG, and WebP?",
        answer: "JPG is best for photographs with many colors, offering good compression but losing some quality. PNG supports transparency and provides lossless compression, ideal for graphics and logos. WebP is a modern format that offers superior compression (30% smaller than JPG) while maintaining quality, and supports both lossy and lossless compression plus transparency."
    },
    {
        question: "Can I compress images without losing quality?",
        answer: "Yes! Our lossless compression mode reduces file size by removing unnecessary data like metadata and optimizing the image structure without affecting visual quality. For even greater compression, you can use near-lossless mode which makes imperceptible quality adjustments for 50-80% size reduction."
    },
    {
        question: "How many images can I process at once?",
        answer: "Guest users can process up to 5 images per batch and 20 images per day. Registered users enjoy higher limits with 50 images per batch and 500 images per day, perfect for bulk optimization of website images or photo galleries."
    },
    {
        question: "Is my data safe and private?",
        answer: "Absolutely! All uploads are processed securely over HTTPS. We automatically delete all processed images from our servers after 24 hours. We never store, share, or use your images for any purpose other than the requested optimization or conversion."
    },
    {
        question: "What image formats do you support?",
        answer: "We support all major image formats including JPG/JPEG, PNG, WebP, GIF, BMP, and SVG. You can convert between any of these formats and optimize them for web use, social media, or print."
    },
    {
        question: "Why should I optimize images for my website?",
        answer: "Optimized images significantly improve website loading speed, which enhances user experience, reduces bounce rates, and improves SEO rankings. Faster websites rank higher in Google search results and provide better mobile experiences. Smaller images also reduce bandwidth costs and server load."
    },
    {
        question: "Can I use optimized images for commercial purposes?",
        answer: "Yes! The optimized images are yours to use however you wish. We don't add watermarks or impose any restrictions. Use them for personal blogs, commercial websites, e-commerce stores, social media, or any other purpose."
    }
];

export default function FAQSection() {
    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h2" component="h2" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
                    Frequently Asked Questions
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
                    Everything you need to know about our free online image optimizer and converter
                </Typography>
            </Box>

            <Box>
                {faqs.map((faq, index) => (
                    <Accordion
                        key={index}
                        sx={{
                            mb: 1,
                            '&:before': { display: 'none' },
                            boxShadow: 1,
                            '&:hover': {
                                boxShadow: 2,
                            },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`faq-${index}-content`}
                            id={`faq-${index}-header`}
                        >
                            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, fontWeight: 600 }}>
                                {faq.question}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                {faq.answer}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>

            <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.50', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    Still have questions?
                </Typography>
                <Typography color="text.secondary">
                    Our free image optimization tool is designed to be simple and intuitive. Just upload your images and let us handle the rest!
                </Typography>
            </Box>
        </Container>
    );
}
