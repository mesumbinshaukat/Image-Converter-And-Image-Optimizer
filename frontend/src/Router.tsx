import { Routes, Route } from 'react-router-dom';
import AdminDashboardPage from './pages/AdminDashboardPage';
import HomePage from './pages/HomePage';
import ImageOptimizerPage from './pages/ImageOptimizerPage';
import ImageConverterPage from './pages/ImageConverterPage';
import BackgroundRemovalPage from './pages/BackgroundRemovalPage';
import LoginPage from './pages/LoginPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

import ProtectedRoute from './components/ProtectedRoute';

function Router() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/optimize" element={<ImageOptimizerPage />} />
            <Route path="/convert" element={<ImageConverterPage />} />
            <Route path="/remove-background" element={<BackgroundRemovalPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-access" element={<LoginPage />} />
            <Route path="/admin-dashboard" element={
                <ProtectedRoute requireAdmin={true}>
                    <AdminDashboardPage />
                </ProtectedRoute>
            } />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default Router
