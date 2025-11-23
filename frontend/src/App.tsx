import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Provider } from 'react-redux'
import { store } from './store'
import Router from './Router'
import NavBar from './components/NavBar';
import CookieConsent from './components/CookieConsent';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#8B5CF6', // Vibrant purple from logo
            light: '#A78BFA',
            dark: '#7C3AED',
        },
        secondary: {
            main: '#EC4899', // Pink accent from logo
            light: '#F472B6',
            dark: '#DB2777',
        },
        background: {
            default: '#F9FAFB',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1F2937',
            secondary: '#6B7280',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 8,
                    padding: '10px 24px',
                },
                contained: {
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.4)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                        boxShadow: '0 6px 20px 0 rgba(139, 92, 246, 0.5)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.1)',
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                },
            },
        },
    },
})

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <NavBar />
                    <Router />
                    <CookieConsent />
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    )
}

export default App
