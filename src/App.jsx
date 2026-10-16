import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompanyProvider } from './context/CompanyContext';
import { Toaster } from 'react-hot-toast';

// Lazy-loaded pages for fast initial load and seamless code splitting
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const Projects = lazy(() => import('./pages/Projects').then(m => ({ default: m.Projects })));
const Testimonials = lazy(() => import('./pages/Testimonials').then(m => ({ default: m.Testimonials })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const RequestQuote = lazy(() => import('./pages/RequestQuote').then(m => ({ default: m.RequestQuote })));
const FAQ = lazy(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const Terms = lazy(() => import('./pages/Terms').then(m => ({ default: m.Terms })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

// Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071827]">
        <LoadingSpinner size="lg" label="Authenticating administrator..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export function App() {

  return (
    <AuthProvider>
      <CompanyProvider>
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={10}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0b2138',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '12px 18px',
              fontSize: '13px',
              fontWeight: '600',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
              style: {
                border: '1px solid rgba(16, 185, 129, 0.35)',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
              style: {
                border: '1px solid rgba(239, 68, 68, 0.35)',
              },
            },
          }}
        />
        <Routes>
          {/* Admin Portal Routes */}
          <Route 
            path="/admin/login" 
            element={
              <Suspense fallback={<div className="min-h-screen bg-[#071827] flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
                <AdminLogin />
              </Suspense>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <Suspense fallback={<div className="min-h-screen bg-[#071827] flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedAdminRoute>
            } 
          />
          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />

          {/* Public Website Routes inside Main Persistent Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="projects" element={<Projects />} />
            <Route path="our-work" element={<Navigate to="/projects" replace />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="contact" element={<Contact />} />
            <Route path="request-a-quote" element={<RequestQuote />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </CompanyProvider>
    </AuthProvider>
  );
}

// Silently prefetch primary public page chunks during browser idle time for zero-lag page navigation
if (typeof window !== 'undefined') {
  const prefetchPublicPages = () => {
    import('./pages/About');
    import('./pages/Services');
    import('./pages/Projects');
    import('./pages/Contact');
    import('./pages/RequestQuote');
  };
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(prefetchPublicPages, { timeout: 2000 });
  } else {
    setTimeout(prefetchPublicPages, 1200);
  }
}

export default App;
