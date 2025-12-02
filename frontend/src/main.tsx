import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Global error handlers for production
if (import.meta.env.PROD) {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Prevent default to avoid duplicate console errors
    event.preventDefault();
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    // Filter out extension errors
    if (event.message?.includes('chrome-extension://')) {
      event.preventDefault();
      return;
    }
    console.error('Uncaught error:', event.error || event.message);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
