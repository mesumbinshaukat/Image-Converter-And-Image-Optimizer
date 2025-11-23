import { Routes, Route } from 'react-router-dom';
import AdminDashboardPage from './pages/AdminDashboardPage.tsx';
import HomePage from './pages/HomePage.tsx';
import ImageOptimizerPage from './pages/ImageOptimizerPage.tsx';
import ImageConverterPage from './pages/ImageConverterPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.tsx';
import TermsOfServicePage from './pages/TermsOfServicePage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

function Router() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/optimize" element={<ImageOptimizerPage />} />
            <Route path="/convert" element={<ImageConverterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-access" element={<LoginPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default Router
