import { useState } from 'react'
import { Container, Typography, Box, Button, Paper, TextField, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function ContactPage() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        honeypot: ''
    })
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            await api.post('/contact', formData)
            setSuccess(true)
            setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' })
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send message')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
            <Container maxWidth="md">


                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Contact Us
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    Have questions? We'd love to hear from you.
                </Typography>

                <Paper sx={{ p: 4 }}>
                    {success && <Alert severity="success" sx={{ mb: 2 }}>Message sent successfully!</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Message"
                            multiline
                            rows={6}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            sx={{ mb: 2 }}
                            required
                        />
                        {/* Honeypot field - hidden from users */}
                        <input
                            type="text"
                            name="honeypot"
                            value={formData.honeypot}
                            onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                            style={{ display: 'none' }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Box>
    )
}

export default ContactPage
